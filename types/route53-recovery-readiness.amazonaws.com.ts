// To parse this data:
//
//   import { Convert, Route53RecoveryReadinessAmazonawsCOM } from "./file";
//
//   const route53RecoveryReadinessAmazonawsCOM = Convert.toRoute53RecoveryReadinessAmazonawsCOM(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Route53RecoveryReadinessAmazonawsCOM {
    $schema:     string;
    type:        string;
    items:       Items;
    definitions: Definitions;
}

export interface Definitions {
    Route53RecoveryReadinessAmazonawsCOMElement: Route53RecoveryReadinessAmazonawsCOMElement;
    Detail:                                      Detail;
    State:                                       State;
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             string[];
    title:                string;
}

export interface DetailProperties {
    "recovery-group-name":  CellName;
    "previous-state":       Items;
    "new-state":            Items;
    "cell-name":            CellName;
    "readiness-check-name": CellName;
}

export interface CellName {
    type: Type;
}

export enum Type {
    Integer = "integer",
    String = "string",
}

export interface Items {
    $ref: string;
}

export interface Route53RecoveryReadinessAmazonawsCOMElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           Route53RecoveryReadinessAmazonawsCOMElementProperties;
    required:             string[];
    title:                string;
}

export interface Route53RecoveryReadinessAmazonawsCOMElementProperties {
    version:       CellName;
    account:       CellName;
    region:        CellName;
    "detail-type": CellName;
    source:        CellName;
    time:          ID;
    id:            ID;
    resources:     Resources;
    detail:        Items;
}

export interface ID {
    type:   Type;
    format: string;
}

export interface Resources {
    type:  string;
    items: CellName;
}

export interface State {
    type:                 string;
    additionalProperties: boolean;
    properties:           StateProperties;
    required:             string[];
    title:                string;
}

export interface StateProperties {
    "readiness-status": CellName;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toRoute53RecoveryReadinessAmazonawsCOM(json: string): Route53RecoveryReadinessAmazonawsCOM {
        return cast(JSON.parse(json), r("Route53RecoveryReadinessAmazonawsCOM"));
    }

    public static route53RecoveryReadinessAmazonawsCOMToJson(value: Route53RecoveryReadinessAmazonawsCOM): string {
        return JSON.stringify(uncast(value, r("Route53RecoveryReadinessAmazonawsCOM")), null, 2);
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
    "Route53RecoveryReadinessAmazonawsCOM": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Items") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "Route53RecoveryReadinessAmazonawsCOMElement", js: "Route53RecoveryReadinessAmazonawsCOMElement", typ: r("Route53RecoveryReadinessAmazonawsCOMElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "State", js: "State", typ: r("State") },
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "recovery-group-name", js: "recovery-group-name", typ: r("CellName") },
        { json: "previous-state", js: "previous-state", typ: r("Items") },
        { json: "new-state", js: "new-state", typ: r("Items") },
        { json: "cell-name", js: "cell-name", typ: r("CellName") },
        { json: "readiness-check-name", js: "readiness-check-name", typ: r("CellName") },
    ], false),
    "CellName": o([
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "Items": o([
        { json: "$ref", js: "$ref", typ: "" },
    ], false),
    "Route53RecoveryReadinessAmazonawsCOMElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("Route53RecoveryReadinessAmazonawsCOMElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "Route53RecoveryReadinessAmazonawsCOMElementProperties": o([
        { json: "version", js: "version", typ: r("CellName") },
        { json: "account", js: "account", typ: r("CellName") },
        { json: "region", js: "region", typ: r("CellName") },
        { json: "detail-type", js: "detail-type", typ: r("CellName") },
        { json: "source", js: "source", typ: r("CellName") },
        { json: "time", js: "time", typ: r("ID") },
        { json: "id", js: "id", typ: r("ID") },
        { json: "resources", js: "resources", typ: r("Resources") },
        { json: "detail", js: "detail", typ: r("Items") },
    ], false),
    "ID": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: "" },
    ], false),
    "Resources": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("CellName") },
    ], false),
    "State": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("StateProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "StateProperties": o([
        { json: "readiness-status", js: "readiness-status", typ: r("CellName") },
    ], false),
    "Type": [
        "integer",
        "string",
    ],
};
