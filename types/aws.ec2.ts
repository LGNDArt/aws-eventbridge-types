// To parse this data:
//
//   import { Convert, AwsEc2 } from "./file";
//
//   const awsEc2 = Convert.toAwsEc2(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsEc2 {
    $schema:     string;
    type:        string;
    items:       Items;
    definitions: Definitions;
}

export interface Definitions {
    AwsEc2Element: AwsEc2Element;
    Detail:        Detail;
    Snapshot:      Snapshot;
    Result:        Region;
    Region:        Region;
    Source:        Region;
}

export interface AwsEc2Element {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsEc2ElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsEc2ElementProperties {
    version:       Time;
    id:            Account;
    "detail-type": Account;
    source:        Items;
    account:       Account;
    time:          Time;
    region:        Items;
    resources:     Resources;
    detail:        Items;
}

export interface Account {
    type: Type;
}

export enum Type {
    Null = "null",
    String = "string",
}

export interface Items {
    $ref: string;
}

export interface Resources {
    type:  string;
    items: Account;
}

export interface Time {
    type:   Type;
    format: string;
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             any[];
    title:                string;
}

export interface DetailProperties {
    "instance-id":              Account;
    state:                      Account;
    event:                      Account;
    result:                     Items;
    cause:                      Account;
    "request-id":               Account;
    snapshot_id:                Account;
    source:                     Account;
    StartTime:                  Time;
    EndTime:                    Time;
    "instance-action":          Account;
    startTime:                  Time;
    endTime:                    Time;
    snapshots:                  Snapshots;
    "spot-instance-request-id": Account;
    "snapshot-id":              Account;
    zone:                       Account;
    message:                    Account;
}

export interface Snapshots {
    type:  string;
    items: Items;
}

export interface Region {
    type:  Type;
    enum:  string[];
    title: string;
}

export interface Snapshot {
    type:                 string;
    additionalProperties: boolean;
    properties:           SnapshotProperties;
    required:             string[];
    title:                string;
}

export interface SnapshotProperties {
    snapshot_id: Account;
    source:      Account;
    status:      Account;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsEc2(json: string): AwsEc2 {
        return cast(JSON.parse(json), r("AwsEc2"));
    }

    public static awsEc2ToJson(value: AwsEc2): string {
        return JSON.stringify(uncast(value, r("AwsEc2")), null, 2);
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
    "AwsEc2": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Items") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsEc2Element", js: "AwsEc2Element", typ: r("AwsEc2Element") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "Snapshot", js: "Snapshot", typ: r("Snapshot") },
        { json: "Result", js: "Result", typ: r("Region") },
        { json: "Region", js: "Region", typ: r("Region") },
        { json: "Source", js: "Source", typ: r("Region") },
    ], false),
    "AwsEc2Element": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsEc2ElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsEc2ElementProperties": o([
        { json: "version", js: "version", typ: r("Time") },
        { json: "id", js: "id", typ: r("Account") },
        { json: "detail-type", js: "detail-type", typ: r("Account") },
        { json: "source", js: "source", typ: r("Items") },
        { json: "account", js: "account", typ: r("Account") },
        { json: "time", js: "time", typ: r("Time") },
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
    "Resources": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Account") },
    ], false),
    "Time": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: "" },
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("any") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "instance-id", js: "instance-id", typ: r("Account") },
        { json: "state", js: "state", typ: r("Account") },
        { json: "event", js: "event", typ: r("Account") },
        { json: "result", js: "result", typ: r("Items") },
        { json: "cause", js: "cause", typ: r("Account") },
        { json: "request-id", js: "request-id", typ: r("Account") },
        { json: "snapshot_id", js: "snapshot_id", typ: r("Account") },
        { json: "source", js: "source", typ: r("Account") },
        { json: "StartTime", js: "StartTime", typ: r("Time") },
        { json: "EndTime", js: "EndTime", typ: r("Time") },
        { json: "instance-action", js: "instance-action", typ: r("Account") },
        { json: "startTime", js: "startTime", typ: r("Time") },
        { json: "endTime", js: "endTime", typ: r("Time") },
        { json: "snapshots", js: "snapshots", typ: r("Snapshots") },
        { json: "spot-instance-request-id", js: "spot-instance-request-id", typ: r("Account") },
        { json: "snapshot-id", js: "snapshot-id", typ: r("Account") },
        { json: "zone", js: "zone", typ: r("Account") },
        { json: "message", js: "message", typ: r("Account") },
    ], false),
    "Snapshots": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Items") },
    ], false),
    "Region": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "enum", js: "enum", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "Snapshot": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("SnapshotProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "SnapshotProperties": o([
        { json: "snapshot_id", js: "snapshot_id", typ: r("Account") },
        { json: "source", js: "source", typ: r("Account") },
        { json: "status", js: "status", typ: r("Account") },
    ], false),
    "Type": [
        "null",
        "string",
    ],
};
