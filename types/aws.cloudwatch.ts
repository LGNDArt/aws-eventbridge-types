// To parse this data:
//
//   import { Convert, AwsCloudwatch } from "./file";
//
//   const awsCloudwatch = Convert.toAwsCloudwatch(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsCloudwatch {
    $schema:     string;
    type:        string;
    items:       DetailClass;
    definitions: Definitions;
}

export interface Definitions {
    AwsCloudwatchElement: AwsCloudwatchElement;
    Detail:               Detail;
    Configuration:        Configuration;
    MetricElement:        MetricElement;
    MetricStat:           MetricStat;
    MetricStatMetric:     MetricStatMetric;
    Dimensions:           Dimensions;
    State:                State;
}

export interface AwsCloudwatchElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsCloudwatchElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsCloudwatchElementProperties {
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
    Boolean = "boolean",
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

export interface Configuration {
    type:                 string;
    additionalProperties: boolean;
    properties:           ConfigurationProperties;
    required:             string[];
    title:                string;
}

export interface ConfigurationProperties {
    description:             Account;
    metrics:                 Metrics;
    evaluationPeriods:       Account;
    threshold:               Account;
    comparisonOperator:      Account;
    treatMissingData:        Account;
    alarmName:               Account;
    actionsEnabled:          Account;
    timestamp:               Account;
    okActions:               Actions;
    alarmActions:            Actions;
    insufficientDataActions: Actions;
}

export interface Actions {
    type:  string;
    items: AlarmActionsItems;
}

export interface AlarmActionsItems {
}

export interface Metrics {
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
    alarmName:     Account;
    configuration: DetailClass;
    previousState: DetailClass;
    state:         DetailClass;
    operation:     Account;
}

export interface Dimensions {
    type:                 string;
    additionalProperties: boolean;
    properties:           DimensionsProperties;
    required:             string[];
    title:                string;
}

export interface DimensionsProperties {
    InstanceId: Account;
}

export interface MetricElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           MetricElementProperties;
    required:             string[];
    title:                string;
}

export interface MetricElementProperties {
    id:         ID;
    metricStat: DetailClass;
    returnData: Account;
}

export interface MetricStat {
    type:                 string;
    additionalProperties: boolean;
    properties:           MetricStatProperties;
    required:             string[];
    title:                string;
}

export interface MetricStatProperties {
    metric: DetailClass;
    period: Account;
    stat:   Account;
}

export interface MetricStatMetric {
    type:                 string;
    additionalProperties: boolean;
    properties:           MetricStatMetricProperties;
    required:             string[];
    title:                string;
}

export interface MetricStatMetricProperties {
    dimensions: DetailClass;
    name:       Account;
    namespace:  Account;
}

export interface State {
    type:                 string;
    additionalProperties: boolean;
    properties:           StateProperties;
    required:             string[];
    title:                string;
}

export interface StateProperties {
    reason:     Account;
    reasonData: Account;
    timestamp:  Account;
    value:      Account;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsCloudwatch(json: string): AwsCloudwatch {
        return cast(JSON.parse(json), r("AwsCloudwatch"));
    }

    public static awsCloudwatchToJson(value: AwsCloudwatch): string {
        return JSON.stringify(uncast(value, r("AwsCloudwatch")), null, 2);
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
    "AwsCloudwatch": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsCloudwatchElement", js: "AwsCloudwatchElement", typ: r("AwsCloudwatchElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "Configuration", js: "Configuration", typ: r("Configuration") },
        { json: "MetricElement", js: "MetricElement", typ: r("MetricElement") },
        { json: "MetricStat", js: "MetricStat", typ: r("MetricStat") },
        { json: "MetricStatMetric", js: "MetricStatMetric", typ: r("MetricStatMetric") },
        { json: "Dimensions", js: "Dimensions", typ: r("Dimensions") },
        { json: "State", js: "State", typ: r("State") },
    ], false),
    "AwsCloudwatchElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsCloudwatchElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsCloudwatchElementProperties": o([
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
    "Configuration": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ConfigurationProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ConfigurationProperties": o([
        { json: "description", js: "description", typ: r("Account") },
        { json: "metrics", js: "metrics", typ: r("Metrics") },
        { json: "evaluationPeriods", js: "evaluationPeriods", typ: r("Account") },
        { json: "threshold", js: "threshold", typ: r("Account") },
        { json: "comparisonOperator", js: "comparisonOperator", typ: r("Account") },
        { json: "treatMissingData", js: "treatMissingData", typ: r("Account") },
        { json: "alarmName", js: "alarmName", typ: r("Account") },
        { json: "actionsEnabled", js: "actionsEnabled", typ: r("Account") },
        { json: "timestamp", js: "timestamp", typ: r("Account") },
        { json: "okActions", js: "okActions", typ: r("Actions") },
        { json: "alarmActions", js: "alarmActions", typ: r("Actions") },
        { json: "insufficientDataActions", js: "insufficientDataActions", typ: r("Actions") },
    ], false),
    "Actions": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("AlarmActionsItems") },
    ], false),
    "AlarmActionsItems": o([
    ], false),
    "Metrics": o([
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
        { json: "alarmName", js: "alarmName", typ: r("Account") },
        { json: "configuration", js: "configuration", typ: r("DetailClass") },
        { json: "previousState", js: "previousState", typ: r("DetailClass") },
        { json: "state", js: "state", typ: r("DetailClass") },
        { json: "operation", js: "operation", typ: r("Account") },
    ], false),
    "Dimensions": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DimensionsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DimensionsProperties": o([
        { json: "InstanceId", js: "InstanceId", typ: r("Account") },
    ], false),
    "MetricElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("MetricElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "MetricElementProperties": o([
        { json: "id", js: "id", typ: r("ID") },
        { json: "metricStat", js: "metricStat", typ: r("DetailClass") },
        { json: "returnData", js: "returnData", typ: r("Account") },
    ], false),
    "MetricStat": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("MetricStatProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "MetricStatProperties": o([
        { json: "metric", js: "metric", typ: r("DetailClass") },
        { json: "period", js: "period", typ: r("Account") },
        { json: "stat", js: "stat", typ: r("Account") },
    ], false),
    "MetricStatMetric": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("MetricStatMetricProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "MetricStatMetricProperties": o([
        { json: "dimensions", js: "dimensions", typ: r("DetailClass") },
        { json: "name", js: "name", typ: r("Account") },
        { json: "namespace", js: "namespace", typ: r("Account") },
    ], false),
    "State": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("StateProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "StateProperties": o([
        { json: "reason", js: "reason", typ: r("Account") },
        { json: "reasonData", js: "reasonData", typ: r("Account") },
        { json: "timestamp", js: "timestamp", typ: r("Account") },
        { json: "value", js: "value", typ: r("Account") },
    ], false),
    "Type": [
        "boolean",
        "integer",
        "string",
    ],
};
