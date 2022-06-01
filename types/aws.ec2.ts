// To parse this data:
//
//   import { Convert } from "./file";
//
//   const awsEc2 = Convert.toAwsEc2(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsEc2 {
    version:       string;
    id:            string;
    "detail-type": string;
    source:        Source;
    account:       string;
    time:          Date;
    region:        Region;
    resources:     string[];
    detail:        Detail;
}

export interface Detail {
    "instance-id"?:              string;
    state?:                      string;
    event?:                      string;
    result?:                     Result;
    cause?:                      string;
    "request-id"?:               string;
    snapshot_id?:                string;
    source?:                     string;
    StartTime?:                  Date;
    EndTime?:                    Date;
    "instance-action"?:          string;
    startTime?:                  Date;
    endTime?:                    Date;
    snapshots?:                  Snapshot[];
    "spot-instance-request-id"?: string;
    "snapshot-id"?:              string;
    zone?:                       null;
    message?:                    string;
}

export enum Result {
    Failed = "failed",
    Succeeded = "succeeded",
}

export interface Snapshot {
    snapshot_id: string;
    source:      string;
    status:      string;
}

export enum Region {
    SaEast1 = "sa-east-1",
    UsEast1 = "us-east-1",
}

export enum Source {
    AwsEc2 = "aws.ec2",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsEc2(json: string): AwsEc2[] {
        return cast(JSON.parse(json), a(r("AwsEc2")));
    }

    public static awsEc2ToJson(value: AwsEc2[]): string {
        return JSON.stringify(uncast(value, a(r("AwsEc2"))), null, 2);
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
        { json: "version", js: "version", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "detail-type", js: "detail-type", typ: "" },
        { json: "source", js: "source", typ: r("Source") },
        { json: "account", js: "account", typ: "" },
        { json: "time", js: "time", typ: Date },
        { json: "region", js: "region", typ: r("Region") },
        { json: "resources", js: "resources", typ: a("") },
        { json: "detail", js: "detail", typ: r("Detail") },
    ], false),
    "Detail": o([
        { json: "instance-id", js: "instance-id", typ: u(undefined, "") },
        { json: "state", js: "state", typ: u(undefined, "") },
        { json: "event", js: "event", typ: u(undefined, "") },
        { json: "result", js: "result", typ: u(undefined, r("Result")) },
        { json: "cause", js: "cause", typ: u(undefined, "") },
        { json: "request-id", js: "request-id", typ: u(undefined, "") },
        { json: "snapshot_id", js: "snapshot_id", typ: u(undefined, "") },
        { json: "source", js: "source", typ: u(undefined, "") },
        { json: "StartTime", js: "StartTime", typ: u(undefined, Date) },
        { json: "EndTime", js: "EndTime", typ: u(undefined, Date) },
        { json: "instance-action", js: "instance-action", typ: u(undefined, "") },
        { json: "startTime", js: "startTime", typ: u(undefined, Date) },
        { json: "endTime", js: "endTime", typ: u(undefined, Date) },
        { json: "snapshots", js: "snapshots", typ: u(undefined, a(r("Snapshot"))) },
        { json: "spot-instance-request-id", js: "spot-instance-request-id", typ: u(undefined, "") },
        { json: "snapshot-id", js: "snapshot-id", typ: u(undefined, "") },
        { json: "zone", js: "zone", typ: u(undefined, null) },
        { json: "message", js: "message", typ: u(undefined, "") },
    ], false),
    "Snapshot": o([
        { json: "snapshot_id", js: "snapshot_id", typ: "" },
        { json: "source", js: "source", typ: "" },
        { json: "status", js: "status", typ: "" },
    ], false),
    "Result": [
        "failed",
        "succeeded",
    ],
    "Region": [
        "sa-east-1",
        "us-east-1",
    ],
    "Source": [
        "aws.ec2",
    ],
};
