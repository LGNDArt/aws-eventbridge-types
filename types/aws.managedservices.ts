// To parse this data:
//
//   import { Convert } from "./file";
//
//   const awsManagedservices = Convert.toAwsManagedservices(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsManagedservices {
    version:       string;
    id:            string;
    source:        string;
    "detail-type": string;
    account:       string;
    time:          Date;
    region:        string;
    resources:     any[];
    detail:        Detail;
}

export interface Detail {
    ActionState:                 string;
    ActualExecutionTimeRange:    ExecutionTimeRange;
    AutomationStatus:            string;
    AwsAccountId:                string;
    AwsApprovalStatus:           string;
    ChangeTypeId:                string;
    ChangeTypeVersion:           string;
    CreatedTime:                 number;
    CustomerApprovalStatus:      string;
    EventType:                   string;
    LastModifiedTime:            number;
    LastSubmittedTime:           number;
    RequestedExecutionTimeRange: ExecutionTimeRange;
    RfcId:                       string;
    Status:                      string;
    Title:                       string;
}

export interface ExecutionTimeRange {
    StartTime: number;
    EndTime:   number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsManagedservices(json: string): AwsManagedservices[] {
        return cast(JSON.parse(json), a(r("AwsManagedservices")));
    }

    public static awsManagedservicesToJson(value: AwsManagedservices[]): string {
        return JSON.stringify(uncast(value, a(r("AwsManagedservices"))), null, 2);
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
    "AwsManagedservices": o([
        { json: "version", js: "version", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "source", js: "source", typ: "" },
        { json: "detail-type", js: "detail-type", typ: "" },
        { json: "account", js: "account", typ: "" },
        { json: "time", js: "time", typ: Date },
        { json: "region", js: "region", typ: "" },
        { json: "resources", js: "resources", typ: a("any") },
        { json: "detail", js: "detail", typ: r("Detail") },
    ], false),
    "Detail": o([
        { json: "ActionState", js: "ActionState", typ: "" },
        { json: "ActualExecutionTimeRange", js: "ActualExecutionTimeRange", typ: r("ExecutionTimeRange") },
        { json: "AutomationStatus", js: "AutomationStatus", typ: "" },
        { json: "AwsAccountId", js: "AwsAccountId", typ: "" },
        { json: "AwsApprovalStatus", js: "AwsApprovalStatus", typ: "" },
        { json: "ChangeTypeId", js: "ChangeTypeId", typ: "" },
        { json: "ChangeTypeVersion", js: "ChangeTypeVersion", typ: "" },
        { json: "CreatedTime", js: "CreatedTime", typ: 0 },
        { json: "CustomerApprovalStatus", js: "CustomerApprovalStatus", typ: "" },
        { json: "EventType", js: "EventType", typ: "" },
        { json: "LastModifiedTime", js: "LastModifiedTime", typ: 0 },
        { json: "LastSubmittedTime", js: "LastSubmittedTime", typ: 0 },
        { json: "RequestedExecutionTimeRange", js: "RequestedExecutionTimeRange", typ: r("ExecutionTimeRange") },
        { json: "RfcId", js: "RfcId", typ: "" },
        { json: "Status", js: "Status", typ: "" },
        { json: "Title", js: "Title", typ: "" },
    ], false),
    "ExecutionTimeRange": o([
        { json: "StartTime", js: "StartTime", typ: 0 },
        { json: "EndTime", js: "EndTime", typ: 0 },
    ], false),
};
