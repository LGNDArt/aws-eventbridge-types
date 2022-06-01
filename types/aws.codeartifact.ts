// To parse this data:
//
//   import { Convert, AwsCodeartifact } from "./file";
//
//   const awsCodeartifact = Convert.toAwsCodeartifact(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsCodeartifact {
    $schema:     string;
    type:        string;
    items:       Items;
    definitions: Definitions;
}

export interface Definitions {
    AwsCodeartifactElement: AwsCodeartifactElement;
    Detail:                 Detail;
    Changes:                Changes;
}

export interface AwsCodeartifactElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsCodeartifactElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsCodeartifactElementProperties {
    version:       ID;
    id:            ID;
    "detail-type": Account;
    source:        Account;
    account:       Account;
    time:          ID;
    region:        Account;
    resources:     Resources;
    detail:        Items;
}

export interface Account {
    type: Type;
}

export enum Type {
    Boolean = "boolean",
    Integer = "integer",
    Null = "null",
    String = "string",
}

export interface Items {
    $ref: string;
}

export interface ID {
    type:   Type;
    format: string;
}

export interface Resources {
    type:  string;
    items: Account;
}

export interface Changes {
    type:                 string;
    additionalProperties: boolean;
    properties:           ChangesProperties;
    required:             string[];
    title:                string;
}

export interface ChangesProperties {
    assetsAdded:     Account;
    assetsRemoved:   Account;
    metadataUpdated: Account;
    assetsUpdated:   Account;
    statusChanged:   Account;
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             string[];
    title:                string;
}

export interface DetailProperties {
    domainName:             Account;
    domainOwner:            Account;
    repositoryName:         Account;
    packageFormat:          Account;
    packageNamespace:       Account;
    packageName:            Account;
    packageVersion:         Account;
    packageVersionState:    Account;
    packageVersionRevision: Account;
    changes:                Items;
    operationType:          Account;
    sequenceNumber:         Account;
    eventDeduplicationId:   Account;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsCodeartifact(json: string): AwsCodeartifact {
        return cast(JSON.parse(json), r("AwsCodeartifact"));
    }

    public static awsCodeartifactToJson(value: AwsCodeartifact): string {
        return JSON.stringify(uncast(value, r("AwsCodeartifact")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "AwsCodeartifact": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Items") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsCodeartifactElement", js: "AwsCodeartifactElement", typ: r("AwsCodeartifactElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "Changes", js: "Changes", typ: r("Changes") },
    ], false),
    "AwsCodeartifactElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsCodeartifactElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsCodeartifactElementProperties": o([
        { json: "version", js: "version", typ: r("ID") },
        { json: "id", js: "id", typ: r("ID") },
        { json: "detail-type", js: "detail-type", typ: r("Account") },
        { json: "source", js: "source", typ: r("Account") },
        { json: "account", js: "account", typ: r("Account") },
        { json: "time", js: "time", typ: r("ID") },
        { json: "region", js: "region", typ: r("Account") },
        { json: "resources", js: "resources", typ: r("Resources") },
        { json: "detail", js: "detail", typ: r("Items") },
    ], false),
    "Account": o([
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "Items": o([
        { json: "$ref", js: "$ref", typ: "" },
    ], false),
    "ID": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: "" },
    ], false),
    "Resources": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Account") },
    ], false),
    "Changes": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ChangesProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ChangesProperties": o([
        { json: "assetsAdded", js: "assetsAdded", typ: r("Account") },
        { json: "assetsRemoved", js: "assetsRemoved", typ: r("Account") },
        { json: "metadataUpdated", js: "metadataUpdated", typ: r("Account") },
        { json: "assetsUpdated", js: "assetsUpdated", typ: r("Account") },
        { json: "statusChanged", js: "statusChanged", typ: r("Account") },
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "domainName", js: "domainName", typ: r("Account") },
        { json: "domainOwner", js: "domainOwner", typ: r("Account") },
        { json: "repositoryName", js: "repositoryName", typ: r("Account") },
        { json: "packageFormat", js: "packageFormat", typ: r("Account") },
        { json: "packageNamespace", js: "packageNamespace", typ: r("Account") },
        { json: "packageName", js: "packageName", typ: r("Account") },
        { json: "packageVersion", js: "packageVersion", typ: r("Account") },
        { json: "packageVersionState", js: "packageVersionState", typ: r("Account") },
        { json: "packageVersionRevision", js: "packageVersionRevision", typ: r("Account") },
        { json: "changes", js: "changes", typ: r("Items") },
        { json: "operationType", js: "operationType", typ: r("Account") },
        { json: "sequenceNumber", js: "sequenceNumber", typ: r("Account") },
        { json: "eventDeduplicationId", js: "eventDeduplicationId", typ: r("Account") },
    ], false),
    "Type": [
        "boolean",
        "integer",
        "null",
        "string",
    ],
};
