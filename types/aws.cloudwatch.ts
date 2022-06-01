// To parse this data:
//
//   import { Convert } from "./file";
//
//   const awsCloudwatch = Convert.toAwsCloudwatch(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsCloudwatch {
    version:       string;
    id:            string;
    "detail-type": string;
    source:        string;
    account:       string;
    time:          Date;
    region:        string;
    resources:     string[];
    detail:        Detail;
}

export interface Detail {
    alarmName:      string;
    configuration:  Configuration;
    previousState?: State;
    state:          State;
    operation?:     string;
}

export interface Configuration {
    description:              string;
    metrics:                  MetricElement[];
    evaluationPeriods?:       number;
    threshold?:               number;
    comparisonOperator?:      string;
    treatMissingData?:        string;
    alarmName?:               string;
    actionsEnabled?:          boolean;
    timestamp?:               string;
    okActions?:               any[];
    alarmActions?:            any[];
    insufficientDataActions?: any[];
}

export interface MetricElement {
    id:         string;
    metricStat: MetricStat;
    returnData: boolean;
}

export interface MetricStat {
    metric: MetricStatMetric;
    period: number;
    stat:   string;
}

export interface MetricStatMetric {
    dimensions: Dimensions;
    name:       string;
    namespace:  string;
}

export interface Dimensions {
    InstanceId: string;
}

export interface State {
    reason?:     string;
    reasonData?: string;
    timestamp:   string;
    value:       string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsCloudwatch(json: string): AwsCloudwatch[] {
        return cast(JSON.parse(json), a(r("AwsCloudwatch")));
    }

    public static awsCloudwatchToJson(value: AwsCloudwatch[]): string {
        return JSON.stringify(uncast(value, a(r("AwsCloudwatch"))), null, 2);
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
        { json: "version", js: "version", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "detail-type", js: "detail-type", typ: "" },
        { json: "source", js: "source", typ: "" },
        { json: "account", js: "account", typ: "" },
        { json: "time", js: "time", typ: Date },
        { json: "region", js: "region", typ: "" },
        { json: "resources", js: "resources", typ: a("") },
        { json: "detail", js: "detail", typ: r("Detail") },
    ], false),
    "Detail": o([
        { json: "alarmName", js: "alarmName", typ: "" },
        { json: "configuration", js: "configuration", typ: r("Configuration") },
        { json: "previousState", js: "previousState", typ: u(undefined, r("State")) },
        { json: "state", js: "state", typ: r("State") },
        { json: "operation", js: "operation", typ: u(undefined, "") },
    ], false),
    "Configuration": o([
        { json: "description", js: "description", typ: "" },
        { json: "metrics", js: "metrics", typ: a(r("MetricElement")) },
        { json: "evaluationPeriods", js: "evaluationPeriods", typ: u(undefined, 0) },
        { json: "threshold", js: "threshold", typ: u(undefined, 0) },
        { json: "comparisonOperator", js: "comparisonOperator", typ: u(undefined, "") },
        { json: "treatMissingData", js: "treatMissingData", typ: u(undefined, "") },
        { json: "alarmName", js: "alarmName", typ: u(undefined, "") },
        { json: "actionsEnabled", js: "actionsEnabled", typ: u(undefined, true) },
        { json: "timestamp", js: "timestamp", typ: u(undefined, "") },
        { json: "okActions", js: "okActions", typ: u(undefined, a("any")) },
        { json: "alarmActions", js: "alarmActions", typ: u(undefined, a("any")) },
        { json: "insufficientDataActions", js: "insufficientDataActions", typ: u(undefined, a("any")) },
    ], false),
    "MetricElement": o([
        { json: "id", js: "id", typ: "" },
        { json: "metricStat", js: "metricStat", typ: r("MetricStat") },
        { json: "returnData", js: "returnData", typ: true },
    ], false),
    "MetricStat": o([
        { json: "metric", js: "metric", typ: r("MetricStatMetric") },
        { json: "period", js: "period", typ: 0 },
        { json: "stat", js: "stat", typ: "" },
    ], false),
    "MetricStatMetric": o([
        { json: "dimensions", js: "dimensions", typ: r("Dimensions") },
        { json: "name", js: "name", typ: "" },
        { json: "namespace", js: "namespace", typ: "" },
    ], false),
    "Dimensions": o([
        { json: "InstanceId", js: "InstanceId", typ: "" },
    ], false),
    "State": o([
        { json: "reason", js: "reason", typ: u(undefined, "") },
        { json: "reasonData", js: "reasonData", typ: u(undefined, "") },
        { json: "timestamp", js: "timestamp", typ: "" },
        { json: "value", js: "value", typ: "" },
    ], false),
};
