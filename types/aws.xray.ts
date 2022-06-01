// To parse this data:
//
//   import { Convert } from "./file";
//
//   const awsXray = Convert.toAwsXray(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsXray {
    version:       string;
    account:       string;
    resources:     any[];
    region:        string;
    time:          Date;
    id:            string;
    source:        string;
    "detail-type": string;
    detail:        Detail;
}

export interface Detail {
    InsightId:                               string;
    Summary:                                 string;
    GroupName:                               string;
    RootCauseServiceId:                      ServiceID;
    Categories:                              string[];
    State:                                   string;
    StartTime:                               number;
    EndTime:                                 null;
    ClientRequestImpactStatistics:           RequestImpactStatistics;
    RootCauseServiceRequestImpactStatistics: RequestImpactStatistics;
    TopAnomalousServices:                    TopAnomalousService[];
    Event:                                   Event;
}

export interface RequestImpactStatistics {
    FaultCount: number;
    OkCount:    number;
    TotalCount: number;
}

export interface Event {
    Summary:                                 string;
    EventTime:                               string;
    ClientRequestImpactStatistics:           RequestImpactStatistics;
    RootCauseServiceRequestImpactStatistics: RequestImpactStatistics;
    TopAnomalousServices:                    TopAnomalousService[];
}

export interface TopAnomalousService {
    ServiceId: ServiceID;
}

export interface ServiceID {
    Type:      string;
    Name:      string;
    Names:     any[];
    AccountId: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsXray(json: string): AwsXray[] {
        return cast(JSON.parse(json), a(r("AwsXray")));
    }

    public static awsXrayToJson(value: AwsXray[]): string {
        return JSON.stringify(uncast(value, a(r("AwsXray"))), null, 2);
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
    "AwsXray": o([
        { json: "version", js: "version", typ: "" },
        { json: "account", js: "account", typ: "" },
        { json: "resources", js: "resources", typ: a("any") },
        { json: "region", js: "region", typ: "" },
        { json: "time", js: "time", typ: Date },
        { json: "id", js: "id", typ: "" },
        { json: "source", js: "source", typ: "" },
        { json: "detail-type", js: "detail-type", typ: "" },
        { json: "detail", js: "detail", typ: r("Detail") },
    ], false),
    "Detail": o([
        { json: "InsightId", js: "InsightId", typ: "" },
        { json: "Summary", js: "Summary", typ: "" },
        { json: "GroupName", js: "GroupName", typ: "" },
        { json: "RootCauseServiceId", js: "RootCauseServiceId", typ: r("ServiceID") },
        { json: "Categories", js: "Categories", typ: a("") },
        { json: "State", js: "State", typ: "" },
        { json: "StartTime", js: "StartTime", typ: 0 },
        { json: "EndTime", js: "EndTime", typ: null },
        { json: "ClientRequestImpactStatistics", js: "ClientRequestImpactStatistics", typ: r("RequestImpactStatistics") },
        { json: "RootCauseServiceRequestImpactStatistics", js: "RootCauseServiceRequestImpactStatistics", typ: r("RequestImpactStatistics") },
        { json: "TopAnomalousServices", js: "TopAnomalousServices", typ: a(r("TopAnomalousService")) },
        { json: "Event", js: "Event", typ: r("Event") },
    ], false),
    "RequestImpactStatistics": o([
        { json: "FaultCount", js: "FaultCount", typ: 0 },
        { json: "OkCount", js: "OkCount", typ: 0 },
        { json: "TotalCount", js: "TotalCount", typ: 0 },
    ], false),
    "Event": o([
        { json: "Summary", js: "Summary", typ: "" },
        { json: "EventTime", js: "EventTime", typ: "" },
        { json: "ClientRequestImpactStatistics", js: "ClientRequestImpactStatistics", typ: r("RequestImpactStatistics") },
        { json: "RootCauseServiceRequestImpactStatistics", js: "RootCauseServiceRequestImpactStatistics", typ: r("RequestImpactStatistics") },
        { json: "TopAnomalousServices", js: "TopAnomalousServices", typ: a(r("TopAnomalousService")) },
    ], false),
    "TopAnomalousService": o([
        { json: "ServiceId", js: "ServiceId", typ: r("ServiceID") },
    ], false),
    "ServiceID": o([
        { json: "Type", js: "Type", typ: "" },
        { json: "Name", js: "Name", typ: "" },
        { json: "Names", js: "Names", typ: a("any") },
        { json: "AccountId", js: "AccountId", typ: "" },
    ], false),
};
