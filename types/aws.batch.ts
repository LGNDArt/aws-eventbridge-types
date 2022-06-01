// To parse this data:
//
//   import { Convert, AwsBatch } from "./file";
//
//   const awsBatch = Convert.toAwsBatch(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsBatch {
    $schema:     string;
    type:        string;
    items:       DetailClass;
    definitions: Definitions;
}

export interface Definitions {
    AwsBatchElement:     AwsBatchElement;
    Detail:              Detail;
    Container:           Container;
    ResourceRequirement: ResourceRequirement;
    Parameters:          Parameters;
    RetryStrategy:       RetryStrategy;
}

export interface AwsBatchElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsBatchElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsBatchElementProperties {
    version:       ID;
    id:            ID;
    "detail-type": Account;
    source:        Account;
    account:       Account;
    time:          ID;
    region:        Account;
    resources:     Resources;
    detail:        DetailClass;
}

export interface Account {
    type: Type;
}

export enum Type {
    Integer = "integer",
    String = "string",
}

export interface DetailClass {
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

export interface Container {
    type:                 string;
    additionalProperties: boolean;
    properties:           ContainerProperties;
    required:             string[];
    title:                string;
}

export interface ContainerProperties {
    image:                Account;
    resourceRequirements: ResourceRequirements;
    command:              Resources;
    volumes:              Environment;
    environment:          Environment;
    mountPoints:          Environment;
    ulimits:              Environment;
}

export interface Environment {
    type:  string;
    items: EnvironmentItems;
}

export interface EnvironmentItems {
}

export interface ResourceRequirements {
    type:  string;
    items: DetailClass;
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             string[];
    title:                string;
}

export interface DetailProperties {
    jobName:       Account;
    jobId:         ID;
    jobQueue:      Account;
    status:        Account;
    attempts:      Environment;
    createdAt:     Account;
    retryStrategy: DetailClass;
    dependsOn:     Environment;
    jobDefinition: Account;
    parameters:    DetailClass;
    container:     DetailClass;
}

export interface Parameters {
    type:                 string;
    additionalProperties: boolean;
    title:                string;
}

export interface ResourceRequirement {
    type:                 string;
    additionalProperties: boolean;
    properties:           ResourceRequirementProperties;
    required:             string[];
    title:                string;
}

export interface ResourceRequirementProperties {
    type:  Account;
    value: ID;
}

export interface RetryStrategy {
    type:                 string;
    additionalProperties: boolean;
    properties:           RetryStrategyProperties;
    required:             string[];
    title:                string;
}

export interface RetryStrategyProperties {
    attempts: Account;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsBatch(json: string): AwsBatch {
        return cast(JSON.parse(json), r("AwsBatch"));
    }

    public static awsBatchToJson(value: AwsBatch): string {
        return JSON.stringify(uncast(value, r("AwsBatch")), null, 2);
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
    "AwsBatch": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsBatchElement", js: "AwsBatchElement", typ: r("AwsBatchElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "Container", js: "Container", typ: r("Container") },
        { json: "ResourceRequirement", js: "ResourceRequirement", typ: r("ResourceRequirement") },
        { json: "Parameters", js: "Parameters", typ: r("Parameters") },
        { json: "RetryStrategy", js: "RetryStrategy", typ: r("RetryStrategy") },
    ], false),
    "AwsBatchElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsBatchElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsBatchElementProperties": o([
        { json: "version", js: "version", typ: r("ID") },
        { json: "id", js: "id", typ: r("ID") },
        { json: "detail-type", js: "detail-type", typ: r("Account") },
        { json: "source", js: "source", typ: r("Account") },
        { json: "account", js: "account", typ: r("Account") },
        { json: "time", js: "time", typ: r("ID") },
        { json: "region", js: "region", typ: r("Account") },
        { json: "resources", js: "resources", typ: r("Resources") },
        { json: "detail", js: "detail", typ: r("DetailClass") },
    ], false),
    "Account": o([
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "DetailClass": o([
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
    "Container": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ContainerProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ContainerProperties": o([
        { json: "image", js: "image", typ: r("Account") },
        { json: "resourceRequirements", js: "resourceRequirements", typ: r("ResourceRequirements") },
        { json: "command", js: "command", typ: r("Resources") },
        { json: "volumes", js: "volumes", typ: r("Environment") },
        { json: "environment", js: "environment", typ: r("Environment") },
        { json: "mountPoints", js: "mountPoints", typ: r("Environment") },
        { json: "ulimits", js: "ulimits", typ: r("Environment") },
    ], false),
    "Environment": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("EnvironmentItems") },
    ], false),
    "EnvironmentItems": o([
    ], false),
    "ResourceRequirements": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "jobName", js: "jobName", typ: r("Account") },
        { json: "jobId", js: "jobId", typ: r("ID") },
        { json: "jobQueue", js: "jobQueue", typ: r("Account") },
        { json: "status", js: "status", typ: r("Account") },
        { json: "attempts", js: "attempts", typ: r("Environment") },
        { json: "createdAt", js: "createdAt", typ: r("Account") },
        { json: "retryStrategy", js: "retryStrategy", typ: r("DetailClass") },
        { json: "dependsOn", js: "dependsOn", typ: r("Environment") },
        { json: "jobDefinition", js: "jobDefinition", typ: r("Account") },
        { json: "parameters", js: "parameters", typ: r("DetailClass") },
        { json: "container", js: "container", typ: r("DetailClass") },
    ], false),
    "Parameters": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ResourceRequirement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ResourceRequirementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ResourceRequirementProperties": o([
        { json: "type", js: "type", typ: r("Account") },
        { json: "value", js: "value", typ: r("ID") },
    ], false),
    "RetryStrategy": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("RetryStrategyProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "RetryStrategyProperties": o([
        { json: "attempts", js: "attempts", typ: r("Account") },
    ], false),
    "Type": [
        "integer",
        "string",
    ],
};
