// To parse this data:
//
//   import { Convert, AwsSWF } from "./file";
//
//   const awsSWF = Convert.toAwsSWF(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsSWF {
    $schema:     string;
    type:        string;
    items:       Items;
    definitions: Definitions;
}

export interface Definitions {
    AwsSWFElement:           AwsSWFElement;
    Detail:                  Detail;
    WorkflowExecutionDetail: WorkflowExecutionDetail;
    ExecutionConfiguration:  ExecutionConfiguration;
    TaskList:                TaskList;
    ExecutionInfo:           ExecutionInfo;
    Execution:               Execution;
    WorkflowType:            WorkflowType;
    OpenCounts:              OpenCounts;
}

export interface AwsSWFElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsSWFElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsSWFElementProperties {
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

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             string[];
    title:                string;
}

export interface DetailProperties {
    eventId:                 Account;
    eventType:               Account;
    workflowExecutionDetail: Items;
}

export interface Execution {
    type:                 string;
    additionalProperties: boolean;
    properties:           ExecutionProperties;
    required:             string[];
    title:                string;
}

export interface ExecutionProperties {
    workflowId: ID;
    runId:      Account;
}

export interface ExecutionConfiguration {
    type:                 string;
    additionalProperties: boolean;
    properties:           ExecutionConfigurationProperties;
    required:             string[];
    title:                string;
}

export interface ExecutionConfigurationProperties {
    taskStartToCloseTimeout:      ID;
    executionStartToCloseTimeout: ID;
    taskList:                     Items;
    taskPriority:                 Account;
    childPolicy:                  Account;
    lambdaRole:                   Account;
}

export interface ExecutionInfo {
    type:                 string;
    additionalProperties: boolean;
    properties:           ExecutionInfoProperties;
    required:             string[];
    title:                string;
}

export interface ExecutionInfoProperties {
    execution:          Items;
    workflowType:       Items;
    startTimestamp:     Account;
    closeTimestamp:     Account;
    executionStatus:    Account;
    closeStatus:        Account;
    parent:             Account;
    parentExecutionArn: Account;
    tagList:            Account;
    cancelRequested:    Account;
}

export interface OpenCounts {
    type:                 string;
    additionalProperties: boolean;
    properties:           OpenCountsProperties;
    required:             string[];
    title:                string;
}

export interface OpenCountsProperties {
    openActivityTasks:           Account;
    openDecisionTasks:           Account;
    openTimers:                  Account;
    openChildWorkflowExecutions: Account;
    openLambdaFunctions:         Account;
}

export interface TaskList {
    type:                 string;
    additionalProperties: boolean;
    properties:           TaskListProperties;
    required:             string[];
    title:                string;
}

export interface TaskListProperties {
    name: ID;
}

export interface WorkflowExecutionDetail {
    type:                 string;
    additionalProperties: boolean;
    properties:           WorkflowExecutionDetailProperties;
    required:             string[];
    title:                string;
}

export interface WorkflowExecutionDetailProperties {
    executionInfo:               Items;
    executionConfiguration:      Items;
    openCounts:                  Items;
    latestActivityTaskTimestamp: Account;
    latestExecutionContext:      Account;
}

export interface WorkflowType {
    type:                 string;
    additionalProperties: boolean;
    properties:           WorkflowTypeProperties;
    required:             string[];
    title:                string;
}

export interface WorkflowTypeProperties {
    name:    Account;
    version: Account;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsSWF(json: string): AwsSWF {
        return cast(JSON.parse(json), r("AwsSWF"));
    }

    public static awsSWFToJson(value: AwsSWF): string {
        return JSON.stringify(uncast(value, r("AwsSWF")), null, 2);
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
    "AwsSWF": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Items") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsSWFElement", js: "AwsSWFElement", typ: r("AwsSWFElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "WorkflowExecutionDetail", js: "WorkflowExecutionDetail", typ: r("WorkflowExecutionDetail") },
        { json: "ExecutionConfiguration", js: "ExecutionConfiguration", typ: r("ExecutionConfiguration") },
        { json: "TaskList", js: "TaskList", typ: r("TaskList") },
        { json: "ExecutionInfo", js: "ExecutionInfo", typ: r("ExecutionInfo") },
        { json: "Execution", js: "Execution", typ: r("Execution") },
        { json: "WorkflowType", js: "WorkflowType", typ: r("WorkflowType") },
        { json: "OpenCounts", js: "OpenCounts", typ: r("OpenCounts") },
    ], false),
    "AwsSWFElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsSWFElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsSWFElementProperties": o([
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
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "eventId", js: "eventId", typ: r("Account") },
        { json: "eventType", js: "eventType", typ: r("Account") },
        { json: "workflowExecutionDetail", js: "workflowExecutionDetail", typ: r("Items") },
    ], false),
    "Execution": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ExecutionProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ExecutionProperties": o([
        { json: "workflowId", js: "workflowId", typ: r("ID") },
        { json: "runId", js: "runId", typ: r("Account") },
    ], false),
    "ExecutionConfiguration": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ExecutionConfigurationProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ExecutionConfigurationProperties": o([
        { json: "taskStartToCloseTimeout", js: "taskStartToCloseTimeout", typ: r("ID") },
        { json: "executionStartToCloseTimeout", js: "executionStartToCloseTimeout", typ: r("ID") },
        { json: "taskList", js: "taskList", typ: r("Items") },
        { json: "taskPriority", js: "taskPriority", typ: r("Account") },
        { json: "childPolicy", js: "childPolicy", typ: r("Account") },
        { json: "lambdaRole", js: "lambdaRole", typ: r("Account") },
    ], false),
    "ExecutionInfo": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ExecutionInfoProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ExecutionInfoProperties": o([
        { json: "execution", js: "execution", typ: r("Items") },
        { json: "workflowType", js: "workflowType", typ: r("Items") },
        { json: "startTimestamp", js: "startTimestamp", typ: r("Account") },
        { json: "closeTimestamp", js: "closeTimestamp", typ: r("Account") },
        { json: "executionStatus", js: "executionStatus", typ: r("Account") },
        { json: "closeStatus", js: "closeStatus", typ: r("Account") },
        { json: "parent", js: "parent", typ: r("Account") },
        { json: "parentExecutionArn", js: "parentExecutionArn", typ: r("Account") },
        { json: "tagList", js: "tagList", typ: r("Account") },
        { json: "cancelRequested", js: "cancelRequested", typ: r("Account") },
    ], false),
    "OpenCounts": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("OpenCountsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "OpenCountsProperties": o([
        { json: "openActivityTasks", js: "openActivityTasks", typ: r("Account") },
        { json: "openDecisionTasks", js: "openDecisionTasks", typ: r("Account") },
        { json: "openTimers", js: "openTimers", typ: r("Account") },
        { json: "openChildWorkflowExecutions", js: "openChildWorkflowExecutions", typ: r("Account") },
        { json: "openLambdaFunctions", js: "openLambdaFunctions", typ: r("Account") },
    ], false),
    "TaskList": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("TaskListProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "TaskListProperties": o([
        { json: "name", js: "name", typ: r("ID") },
    ], false),
    "WorkflowExecutionDetail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("WorkflowExecutionDetailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "WorkflowExecutionDetailProperties": o([
        { json: "executionInfo", js: "executionInfo", typ: r("Items") },
        { json: "executionConfiguration", js: "executionConfiguration", typ: r("Items") },
        { json: "openCounts", js: "openCounts", typ: r("Items") },
        { json: "latestActivityTaskTimestamp", js: "latestActivityTaskTimestamp", typ: r("Account") },
        { json: "latestExecutionContext", js: "latestExecutionContext", typ: r("Account") },
    ], false),
    "WorkflowType": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("WorkflowTypeProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "WorkflowTypeProperties": o([
        { json: "name", js: "name", typ: r("Account") },
        { json: "version", js: "version", typ: r("Account") },
    ], false),
    "Type": [
        "boolean",
        "integer",
        "null",
        "string",
    ],
};
