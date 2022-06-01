// To parse this data:
//
//   import { Convert, AwsSsm } from "./file";
//
//   const awsSsm = Convert.toAwsSsm(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsSsm {
    $schema:     string;
    type:        string;
    items:       Items;
    definitions: Definitions;
}

export interface Definitions {
    AwsSsmElement: AwsSsmElement;
    Detail:        Detail;
    Parameters:    Parameters;
    DocumentName:  DocumentName;
    Region:        DocumentName;
    Source:        DocumentName;
}

export interface AwsSsmElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsSsmElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsSsmElementProperties {
    version:       ID;
    id:            ID;
    "detail-type": Account;
    source:        Items;
    account:       Account;
    time:          ID;
    region:        Items;
    resources:     Resources;
    detail:        Items;
}

export interface Account {
    type: Type;
}

export enum Type {
    Integer = "integer",
    String = "string",
}

export interface Items {
    $ref: string;
}

export interface ID {
    type:   Type;
    format: Format;
}

export enum Format {
    DateTime = "date-time",
    Integer = "integer",
    UUID = "uuid",
}

export interface Resources {
    type:  string;
    items: Account;
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             any[];
    title:                string;
}

export interface DetailProperties {
    "command-id":                          ID;
    "document-name":                       Items;
    "expire-after":                        ID;
    parameters:                            Items;
    "requested-date-time":                 ID;
    status:                                Account;
    "instance-id":                         Account;
    ExecutionId:                           ID;
    Definition:                            Account;
    DefinitionVersion:                     Account;
    Status:                                Account;
    EndTime:                               Account;
    StartTime:                             Account;
    Time:                                  Account;
    StepName:                              Account;
    Action:                                Account;
    ExecutedBy:                            Account;
    "window-target-id":                    ID;
    "window-id":                           Account;
    "start-time":                          ID;
    "end-time":                            ID;
    "window-execution-id":                 ID;
    "task-execution-id":                   ID;
    "owner-information":                   Account;
    "window-task-id":                      ID;
    operation:                             Account;
    name:                                  Account;
    type:                                  Account;
    description:                           Account;
    "policy-type":                         Account;
    "parameter-name":                      Account;
    "parameter-type":                      Account;
    "policy-content":                      Account;
    "action-status":                       Account;
    "action-reason":                       Account;
    "association-id":                      ID;
    "association-version":                 ID;
    "document-version":                    Account;
    targets:                               Account;
    "creation-date":                       ID;
    "last-successful-execution-date":      ID;
    "last-execution-date":                 ID;
    "last-updated-date":                   ID;
    "association-status-aggregated-count": Account;
    "schedule-expression":                 Account;
    "association-cwe-version":             Account;
    "detailed-status":                     Account;
    "error-code":                          Account;
    "execution-summary":                   Account;
    "output-url":                          Account;
    "instance-association-cwe-version":    ID;
    "last-runtime":                        ID;
    "compliance-status":                   Account;
    "resource-type":                       Account;
    "resource-id":                         Account;
    "compliance-type":                     Account;
    "patch-baseline-id":                   Account;
    severity:                              Account;
    state:                                 Account;
    atTime:                                ID;
    event:                                 Account;
    nextTransitionTime:                    ID;
}

export interface DocumentName {
    type:  Type;
    enum:  string[];
    title: string;
}

export interface Parameters {
    type:                 string;
    additionalProperties: boolean;
    properties:           ParametersProperties;
    required:             string[];
    title:                string;
}

export interface ParametersProperties {
    executionTimeout: ExecutionTimeout;
    commands:         Resources;
}

export interface ExecutionTimeout {
    type:  string;
    items: ID;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsSsm(json: string): AwsSsm {
        return cast(JSON.parse(json), r("AwsSsm"));
    }

    public static awsSsmToJson(value: AwsSsm): string {
        return JSON.stringify(uncast(value, r("AwsSsm")), null, 2);
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
    "AwsSsm": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Items") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsSsmElement", js: "AwsSsmElement", typ: r("AwsSsmElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "Parameters", js: "Parameters", typ: r("Parameters") },
        { json: "DocumentName", js: "DocumentName", typ: r("DocumentName") },
        { json: "Region", js: "Region", typ: r("DocumentName") },
        { json: "Source", js: "Source", typ: r("DocumentName") },
    ], false),
    "AwsSsmElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsSsmElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsSsmElementProperties": o([
        { json: "version", js: "version", typ: r("ID") },
        { json: "id", js: "id", typ: r("ID") },
        { json: "detail-type", js: "detail-type", typ: r("Account") },
        { json: "source", js: "source", typ: r("Items") },
        { json: "account", js: "account", typ: r("Account") },
        { json: "time", js: "time", typ: r("ID") },
        { json: "region", js: "region", typ: r("Items") },
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
        { json: "format", js: "format", typ: r("Format") },
    ], false),
    "Resources": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Account") },
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("any") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "command-id", js: "command-id", typ: r("ID") },
        { json: "document-name", js: "document-name", typ: r("Items") },
        { json: "expire-after", js: "expire-after", typ: r("ID") },
        { json: "parameters", js: "parameters", typ: r("Items") },
        { json: "requested-date-time", js: "requested-date-time", typ: r("ID") },
        { json: "status", js: "status", typ: r("Account") },
        { json: "instance-id", js: "instance-id", typ: r("Account") },
        { json: "ExecutionId", js: "ExecutionId", typ: r("ID") },
        { json: "Definition", js: "Definition", typ: r("Account") },
        { json: "DefinitionVersion", js: "DefinitionVersion", typ: r("Account") },
        { json: "Status", js: "Status", typ: r("Account") },
        { json: "EndTime", js: "EndTime", typ: r("Account") },
        { json: "StartTime", js: "StartTime", typ: r("Account") },
        { json: "Time", js: "Time", typ: r("Account") },
        { json: "StepName", js: "StepName", typ: r("Account") },
        { json: "Action", js: "Action", typ: r("Account") },
        { json: "ExecutedBy", js: "ExecutedBy", typ: r("Account") },
        { json: "window-target-id", js: "window-target-id", typ: r("ID") },
        { json: "window-id", js: "window-id", typ: r("Account") },
        { json: "start-time", js: "start-time", typ: r("ID") },
        { json: "end-time", js: "end-time", typ: r("ID") },
        { json: "window-execution-id", js: "window-execution-id", typ: r("ID") },
        { json: "task-execution-id", js: "task-execution-id", typ: r("ID") },
        { json: "owner-information", js: "owner-information", typ: r("Account") },
        { json: "window-task-id", js: "window-task-id", typ: r("ID") },
        { json: "operation", js: "operation", typ: r("Account") },
        { json: "name", js: "name", typ: r("Account") },
        { json: "type", js: "type", typ: r("Account") },
        { json: "description", js: "description", typ: r("Account") },
        { json: "policy-type", js: "policy-type", typ: r("Account") },
        { json: "parameter-name", js: "parameter-name", typ: r("Account") },
        { json: "parameter-type", js: "parameter-type", typ: r("Account") },
        { json: "policy-content", js: "policy-content", typ: r("Account") },
        { json: "action-status", js: "action-status", typ: r("Account") },
        { json: "action-reason", js: "action-reason", typ: r("Account") },
        { json: "association-id", js: "association-id", typ: r("ID") },
        { json: "association-version", js: "association-version", typ: r("ID") },
        { json: "document-version", js: "document-version", typ: r("Account") },
        { json: "targets", js: "targets", typ: r("Account") },
        { json: "creation-date", js: "creation-date", typ: r("ID") },
        { json: "last-successful-execution-date", js: "last-successful-execution-date", typ: r("ID") },
        { json: "last-execution-date", js: "last-execution-date", typ: r("ID") },
        { json: "last-updated-date", js: "last-updated-date", typ: r("ID") },
        { json: "association-status-aggregated-count", js: "association-status-aggregated-count", typ: r("Account") },
        { json: "schedule-expression", js: "schedule-expression", typ: r("Account") },
        { json: "association-cwe-version", js: "association-cwe-version", typ: r("Account") },
        { json: "detailed-status", js: "detailed-status", typ: r("Account") },
        { json: "error-code", js: "error-code", typ: r("Account") },
        { json: "execution-summary", js: "execution-summary", typ: r("Account") },
        { json: "output-url", js: "output-url", typ: r("Account") },
        { json: "instance-association-cwe-version", js: "instance-association-cwe-version", typ: r("ID") },
        { json: "last-runtime", js: "last-runtime", typ: r("ID") },
        { json: "compliance-status", js: "compliance-status", typ: r("Account") },
        { json: "resource-type", js: "resource-type", typ: r("Account") },
        { json: "resource-id", js: "resource-id", typ: r("Account") },
        { json: "compliance-type", js: "compliance-type", typ: r("Account") },
        { json: "patch-baseline-id", js: "patch-baseline-id", typ: r("Account") },
        { json: "severity", js: "severity", typ: r("Account") },
        { json: "state", js: "state", typ: r("Account") },
        { json: "atTime", js: "atTime", typ: r("ID") },
        { json: "event", js: "event", typ: r("Account") },
        { json: "nextTransitionTime", js: "nextTransitionTime", typ: r("ID") },
    ], false),
    "DocumentName": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "enum", js: "enum", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "Parameters": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ParametersProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ParametersProperties": o([
        { json: "executionTimeout", js: "executionTimeout", typ: r("ExecutionTimeout") },
        { json: "commands", js: "commands", typ: r("Resources") },
    ], false),
    "ExecutionTimeout": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("ID") },
    ], false),
    "Type": [
        "integer",
        "string",
    ],
    "Format": [
        "date-time",
        "integer",
        "uuid",
    ],
};
