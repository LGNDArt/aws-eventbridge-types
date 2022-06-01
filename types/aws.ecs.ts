// To parse this data:
//
//   import { Convert, AwsEcs } from "./file";
//
//   const awsEcs = Convert.toAwsEcs(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsEcs {
    $schema:     string;
    type:        string;
    items:       Items;
    definitions: Definitions;
}

export interface Definitions {
    AwsEc:             AwsEc;
    Detail:            Detail;
    Container:         Container;
    Overrides:         Overrides;
    ContainerOverride: ContainerOverride;
    Environment:       EnvironmentClass;
    Resource:          Resource;
    VersionInfo:       VersionInfo;
}

export interface AwsEc {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsEcProperties;
    required:             string[];
    title:                string;
}

export interface AwsEcProperties {
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

export interface Container {
    type:                 string;
    additionalProperties: boolean;
    properties:           ContainerProperties;
    required:             string[];
    title:                string;
}

export interface ContainerProperties {
    containerArn: Account;
    lastStatus:   Account;
    name:         Account;
    taskArn:      Account;
}

export interface ContainerOverride {
    type:                 string;
    additionalProperties: boolean;
    properties:           ContainerOverrideProperties;
    required:             string[];
    title:                string;
}

export interface ContainerOverrideProperties {
    command:     Resources;
    environment: Environment;
    name:        Account;
}

export interface Environment {
    type:  string;
    items: Items;
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             string[];
    title:                string;
}

export interface DetailProperties {
    agentConnected:       Account;
    clusterArn:           Account;
    containerInstanceArn: Account;
    pendingTasksCount:    Account;
    registeredResources:  Environment;
    remainingResources:   Environment;
    runningTasksCount:    Account;
    status:               Account;
    version:              Account;
    versionInfo:          Items;
    updatedAt:            ID;
    containers:           Environment;
    createdAt:            ID;
    desiredStatus:        Account;
    lastStatus:           Account;
    overrides:            Items;
    taskArn:              Account;
    taskDefinitionArn:    Account;
}

export interface EnvironmentClass {
    type:                 string;
    additionalProperties: boolean;
    properties:           EnvironmentProperties;
    required:             string[];
    title:                string;
}

export interface EnvironmentProperties {
    name:  Account;
    value: Account;
}

export interface Overrides {
    type:                 string;
    additionalProperties: boolean;
    properties:           OverridesProperties;
    required:             string[];
    title:                string;
}

export interface OverridesProperties {
    containerOverrides: Environment;
}

export interface Resource {
    type:                 string;
    additionalProperties: boolean;
    properties:           ResourceProperties;
    required:             string[];
    title:                string;
}

export interface ResourceProperties {
    name:         Account;
    type:         Account;
    integerValue: Account;
}

export interface VersionInfo {
    type:                 string;
    additionalProperties: boolean;
    title:                string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsEcs(json: string): AwsEcs {
        return cast(JSON.parse(json), r("AwsEcs"));
    }

    public static awsEcsToJson(value: AwsEcs): string {
        return JSON.stringify(uncast(value, r("AwsEcs")), null, 2);
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
    "AwsEcs": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Items") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsEc", js: "AwsEc", typ: r("AwsEc") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "Container", js: "Container", typ: r("Container") },
        { json: "Overrides", js: "Overrides", typ: r("Overrides") },
        { json: "ContainerOverride", js: "ContainerOverride", typ: r("ContainerOverride") },
        { json: "Environment", js: "Environment", typ: r("EnvironmentClass") },
        { json: "Resource", js: "Resource", typ: r("Resource") },
        { json: "VersionInfo", js: "VersionInfo", typ: r("VersionInfo") },
    ], false),
    "AwsEc": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsEcProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsEcProperties": o([
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
    "Container": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ContainerProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ContainerProperties": o([
        { json: "containerArn", js: "containerArn", typ: r("Account") },
        { json: "lastStatus", js: "lastStatus", typ: r("Account") },
        { json: "name", js: "name", typ: r("Account") },
        { json: "taskArn", js: "taskArn", typ: r("Account") },
    ], false),
    "ContainerOverride": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ContainerOverrideProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ContainerOverrideProperties": o([
        { json: "command", js: "command", typ: r("Resources") },
        { json: "environment", js: "environment", typ: r("Environment") },
        { json: "name", js: "name", typ: r("Account") },
    ], false),
    "Environment": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Items") },
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "agentConnected", js: "agentConnected", typ: r("Account") },
        { json: "clusterArn", js: "clusterArn", typ: r("Account") },
        { json: "containerInstanceArn", js: "containerInstanceArn", typ: r("Account") },
        { json: "pendingTasksCount", js: "pendingTasksCount", typ: r("Account") },
        { json: "registeredResources", js: "registeredResources", typ: r("Environment") },
        { json: "remainingResources", js: "remainingResources", typ: r("Environment") },
        { json: "runningTasksCount", js: "runningTasksCount", typ: r("Account") },
        { json: "status", js: "status", typ: r("Account") },
        { json: "version", js: "version", typ: r("Account") },
        { json: "versionInfo", js: "versionInfo", typ: r("Items") },
        { json: "updatedAt", js: "updatedAt", typ: r("ID") },
        { json: "containers", js: "containers", typ: r("Environment") },
        { json: "createdAt", js: "createdAt", typ: r("ID") },
        { json: "desiredStatus", js: "desiredStatus", typ: r("Account") },
        { json: "lastStatus", js: "lastStatus", typ: r("Account") },
        { json: "overrides", js: "overrides", typ: r("Items") },
        { json: "taskArn", js: "taskArn", typ: r("Account") },
        { json: "taskDefinitionArn", js: "taskDefinitionArn", typ: r("Account") },
    ], false),
    "EnvironmentClass": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("EnvironmentProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "EnvironmentProperties": o([
        { json: "name", js: "name", typ: r("Account") },
        { json: "value", js: "value", typ: r("Account") },
    ], false),
    "Overrides": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("OverridesProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "OverridesProperties": o([
        { json: "containerOverrides", js: "containerOverrides", typ: r("Environment") },
    ], false),
    "Resource": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ResourceProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ResourceProperties": o([
        { json: "name", js: "name", typ: r("Account") },
        { json: "type", js: "type", typ: r("Account") },
        { json: "integerValue", js: "integerValue", typ: r("Account") },
    ], false),
    "VersionInfo": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "title", js: "title", typ: "" },
    ], false),
    "Type": [
        "boolean",
        "integer",
        "string",
    ],
};
