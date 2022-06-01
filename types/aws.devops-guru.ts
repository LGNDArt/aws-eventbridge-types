// To parse this data:
//
//   import { Convert } from "./file";
//
//   const awsDevopsGuru = Convert.toAwsDevopsGuru(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsDevopsGuru {
    version:       string;
    id:            string;
    "detail-type": string;
    source:        string;
    account:       string;
    time:          Date;
    region:        string;
    resources:     any[];
    detail:        Detail;
}

export interface Detail {
    insightSeverity?:    string;
    insightDescription?: string;
    insightType?:        string;
    anomalies?:          Anomaly[];
    accountId:           string;
    messageType:         string;
    insightUrl?:         string;
    startTime?:          string;
    insightId:           string;
    region:              string;
    endTime?:            string;
    recommendations?:    Recommendation[];
}

export interface Anomaly {
    startTime:     string;
    id:            string;
    sourceDetails: SourceDetail[];
    endTime?:      string;
}

export interface SourceDetail {
    dataSource:      string;
    dataIdentifiers: DataIdentifiers;
}

export interface DataIdentifiers {
    period:        string;
    stat:          string;
    unit:          string;
    name:          string;
    namespace:     string;
    dimensions:    Dimension[] | Dimension;
    ResourceId?:   string;
    ResourceType?: string;
}

export interface Dimension {
    name:  string;
    value: string;
}

export interface Recommendation {
    name:             string;
    description:      string;
    reason:           string;
    link:             string;
    relatedEvents:    any[];
    relatedAnomalies: RelatedAnomaly[];
}

export interface RelatedAnomaly {
    sourceDetails: SourceDetails;
    resources:     Resource[];
}

export interface Resource {
    name: string;
    type: string;
}

export interface SourceDetails {
    cloudWatchMetrics: CloudWatchMetric[];
}

export interface CloudWatchMetric {
    metricName: string;
    namespace:  string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsDevopsGuru(json: string): AwsDevopsGuru[] {
        return cast(JSON.parse(json), a(r("AwsDevopsGuru")));
    }

    public static awsDevopsGuruToJson(value: AwsDevopsGuru[]): string {
        return JSON.stringify(uncast(value, a(r("AwsDevopsGuru"))), null, 2);
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
    "AwsDevopsGuru": o([
        { json: "version", js: "version", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "detail-type", js: "detail-type", typ: "" },
        { json: "source", js: "source", typ: "" },
        { json: "account", js: "account", typ: "" },
        { json: "time", js: "time", typ: Date },
        { json: "region", js: "region", typ: "" },
        { json: "resources", js: "resources", typ: a("any") },
        { json: "detail", js: "detail", typ: r("Detail") },
    ], false),
    "Detail": o([
        { json: "insightSeverity", js: "insightSeverity", typ: u(undefined, "") },
        { json: "insightDescription", js: "insightDescription", typ: u(undefined, "") },
        { json: "insightType", js: "insightType", typ: u(undefined, "") },
        { json: "anomalies", js: "anomalies", typ: u(undefined, a(r("Anomaly"))) },
        { json: "accountId", js: "accountId", typ: "" },
        { json: "messageType", js: "messageType", typ: "" },
        { json: "insightUrl", js: "insightUrl", typ: u(undefined, "") },
        { json: "startTime", js: "startTime", typ: u(undefined, "") },
        { json: "insightId", js: "insightId", typ: "" },
        { json: "region", js: "region", typ: "" },
        { json: "endTime", js: "endTime", typ: u(undefined, "") },
        { json: "recommendations", js: "recommendations", typ: u(undefined, a(r("Recommendation"))) },
    ], false),
    "Anomaly": o([
        { json: "startTime", js: "startTime", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "sourceDetails", js: "sourceDetails", typ: a(r("SourceDetail")) },
        { json: "endTime", js: "endTime", typ: u(undefined, "") },
    ], false),
    "SourceDetail": o([
        { json: "dataSource", js: "dataSource", typ: "" },
        { json: "dataIdentifiers", js: "dataIdentifiers", typ: r("DataIdentifiers") },
    ], false),
    "DataIdentifiers": o([
        { json: "period", js: "period", typ: "" },
        { json: "stat", js: "stat", typ: "" },
        { json: "unit", js: "unit", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "namespace", js: "namespace", typ: "" },
        { json: "dimensions", js: "dimensions", typ: u(a(r("Dimension")), r("Dimension")) },
        { json: "ResourceId", js: "ResourceId", typ: u(undefined, "") },
        { json: "ResourceType", js: "ResourceType", typ: u(undefined, "") },
    ], false),
    "Dimension": o([
        { json: "name", js: "name", typ: "" },
        { json: "value", js: "value", typ: "" },
    ], false),
    "Recommendation": o([
        { json: "name", js: "name", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "reason", js: "reason", typ: "" },
        { json: "link", js: "link", typ: "" },
        { json: "relatedEvents", js: "relatedEvents", typ: a("any") },
        { json: "relatedAnomalies", js: "relatedAnomalies", typ: a(r("RelatedAnomaly")) },
    ], false),
    "RelatedAnomaly": o([
        { json: "sourceDetails", js: "sourceDetails", typ: r("SourceDetails") },
        { json: "resources", js: "resources", typ: a(r("Resource")) },
    ], false),
    "Resource": o([
        { json: "name", js: "name", typ: "" },
        { json: "type", js: "type", typ: "" },
    ], false),
    "SourceDetails": o([
        { json: "cloudWatchMetrics", js: "cloudWatchMetrics", typ: a(r("CloudWatchMetric")) },
    ], false),
    "CloudWatchMetric": o([
        { json: "metricName", js: "metricName", typ: "" },
        { json: "namespace", js: "namespace", typ: "" },
    ], false),
};
