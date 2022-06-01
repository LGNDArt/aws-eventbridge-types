// To parse this data:
//
//   import { Convert, AwsAutoscaling } from "./file";
//
//   const awsAutoscaling = Convert.toAwsAutoscaling(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsAutoscaling {
    $schema:     string;
    type:        string;
    items:       Items;
    definitions: Definitions;
}

export interface Definitions {
    AwsAutoscalingElement: AwsAutoscalingElement;
    Detail:                Detail;
    Details:               Details;
    Region:                Region;
    Source:                Region;
}

export interface AwsAutoscalingElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsAutoscalingElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsAutoscalingElementProperties {
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
    required:             string[];
    title:                string;
}

export interface DetailProperties {
    StatusCode:           Account;
    AutoScalingGroupName: Account;
    ActivityId:           ID;
    Details:              Items;
    RequestId:            ID;
    EndTime:              ID;
    EC2InstanceId:        Account;
    StartTime:            ID;
    Cause:                Account;
    Description:          Account;
    StatusMessage:        Account;
    LifecycleActionToken: ID;
    LifecycleHookName:    Account;
    LifecycleTransition:  Account;
    InstanceRefreshId:    ID;
    CheckpointPercentage: ID;
    CheckpointDelay:      ID;
}

export interface Details {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailsProperties;
    required:             string[];
    title:                string;
}

export interface DetailsProperties {
    "Availability Zone": Account;
    "Subnet ID":         Account;
}

export interface Region {
    type:  Type;
    enum:  string[];
    title: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsAutoscaling(json: string): AwsAutoscaling {
        return cast(JSON.parse(json), r("AwsAutoscaling"));
    }

    public static awsAutoscalingToJson(value: AwsAutoscaling): string {
        return JSON.stringify(uncast(value, r("AwsAutoscaling")), null, 2);
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
    "AwsAutoscaling": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Items") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsAutoscalingElement", js: "AwsAutoscalingElement", typ: r("AwsAutoscalingElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "Details", js: "Details", typ: r("Details") },
        { json: "Region", js: "Region", typ: r("Region") },
        { json: "Source", js: "Source", typ: r("Region") },
    ], false),
    "AwsAutoscalingElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsAutoscalingElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsAutoscalingElementProperties": o([
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
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "StatusCode", js: "StatusCode", typ: r("Account") },
        { json: "AutoScalingGroupName", js: "AutoScalingGroupName", typ: r("Account") },
        { json: "ActivityId", js: "ActivityId", typ: r("ID") },
        { json: "Details", js: "Details", typ: r("Items") },
        { json: "RequestId", js: "RequestId", typ: r("ID") },
        { json: "EndTime", js: "EndTime", typ: r("ID") },
        { json: "EC2InstanceId", js: "EC2InstanceId", typ: r("Account") },
        { json: "StartTime", js: "StartTime", typ: r("ID") },
        { json: "Cause", js: "Cause", typ: r("Account") },
        { json: "Description", js: "Description", typ: r("Account") },
        { json: "StatusMessage", js: "StatusMessage", typ: r("Account") },
        { json: "LifecycleActionToken", js: "LifecycleActionToken", typ: r("ID") },
        { json: "LifecycleHookName", js: "LifecycleHookName", typ: r("Account") },
        { json: "LifecycleTransition", js: "LifecycleTransition", typ: r("Account") },
        { json: "InstanceRefreshId", js: "InstanceRefreshId", typ: r("ID") },
        { json: "CheckpointPercentage", js: "CheckpointPercentage", typ: r("ID") },
        { json: "CheckpointDelay", js: "CheckpointDelay", typ: r("ID") },
    ], false),
    "Details": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailsProperties": o([
        { json: "Availability Zone", js: "Availability Zone", typ: r("Account") },
        { json: "Subnet ID", js: "Subnet ID", typ: r("Account") },
    ], false),
    "Region": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "enum", js: "enum", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "Type": [
        "string",
    ],
    "Format": [
        "date-time",
        "integer",
        "uuid",
    ],
};
