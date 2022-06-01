// To parse this data:
//
//   import { Convert } from "./file";
//
//   const awsSsm = Convert.toAwsSsm(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsSsm {
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
    "command-id"?:                          string;
    "document-name"?:                       DocumentName;
    "expire-after"?:                        Date;
    parameters?:                            Parameters;
    "requested-date-time"?:                 Date;
    status?:                                string;
    "instance-id"?:                         string;
    ExecutionId?:                           string;
    Definition?:                            string;
    DefinitionVersion?:                     number;
    Status?:                                string;
    EndTime?:                               string;
    StartTime?:                             string;
    Time?:                                  number;
    StepName?:                              string;
    Action?:                                string;
    ExecutedBy?:                            string;
    "window-target-id"?:                    string;
    "window-id"?:                           string;
    "start-time"?:                          Date;
    "end-time"?:                            Date;
    "window-execution-id"?:                 string;
    "task-execution-id"?:                   string;
    "owner-information"?:                   string;
    "window-task-id"?:                      string;
    operation?:                             string;
    name?:                                  string;
    type?:                                  string;
    description?:                           string;
    "policy-type"?:                         string;
    "parameter-name"?:                      string;
    "parameter-type"?:                      string;
    "policy-content"?:                      string;
    "action-status"?:                       string;
    "action-reason"?:                       string;
    "association-id"?:                      string;
    "association-version"?:                 string;
    "document-version"?:                    string;
    targets?:                               string;
    "creation-date"?:                       Date;
    "last-successful-execution-date"?:      Date;
    "last-execution-date"?:                 Date;
    "last-updated-date"?:                   Date;
    "association-status-aggregated-count"?: string;
    "schedule-expression"?:                 string;
    "association-cwe-version"?:             string;
    "detailed-status"?:                     string;
    "error-code"?:                          string;
    "execution-summary"?:                   string;
    "output-url"?:                          string;
    "instance-association-cwe-version"?:    string;
    "last-runtime"?:                        Date;
    "compliance-status"?:                   string;
    "resource-type"?:                       string;
    "resource-id"?:                         string;
    "compliance-type"?:                     string;
    "patch-baseline-id"?:                   string;
    severity?:                              string;
    state?:                                 string;
    atTime?:                                Date;
    event?:                                 string;
    nextTransitionTime?:                    Date;
}

export enum DocumentName {
    AWSRunPowerShellScript = "AWS-RunPowerShellScript",
    MyCustomDocument = "my-custom-document",
}

export interface Parameters {
    executionTimeout: string[];
    commands:         string[];
}

export enum Region {
    UsEast1 = "us-east-1",
    UsWest1 = "us-west-1",
    UsWest2 = "us-west-2",
}

export enum Source {
    AwsSsm = "aws.ssm",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsSsm(json: string): AwsSsm[] {
        return cast(JSON.parse(json), a(r("AwsSsm")));
    }

    public static awsSsmToJson(value: AwsSsm[]): string {
        return JSON.stringify(uncast(value, a(r("AwsSsm"))), null, 2);
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
        { json: "command-id", js: "command-id", typ: u(undefined, "") },
        { json: "document-name", js: "document-name", typ: u(undefined, r("DocumentName")) },
        { json: "expire-after", js: "expire-after", typ: u(undefined, Date) },
        { json: "parameters", js: "parameters", typ: u(undefined, r("Parameters")) },
        { json: "requested-date-time", js: "requested-date-time", typ: u(undefined, Date) },
        { json: "status", js: "status", typ: u(undefined, "") },
        { json: "instance-id", js: "instance-id", typ: u(undefined, "") },
        { json: "ExecutionId", js: "ExecutionId", typ: u(undefined, "") },
        { json: "Definition", js: "Definition", typ: u(undefined, "") },
        { json: "DefinitionVersion", js: "DefinitionVersion", typ: u(undefined, 0) },
        { json: "Status", js: "Status", typ: u(undefined, "") },
        { json: "EndTime", js: "EndTime", typ: u(undefined, "") },
        { json: "StartTime", js: "StartTime", typ: u(undefined, "") },
        { json: "Time", js: "Time", typ: u(undefined, 0) },
        { json: "StepName", js: "StepName", typ: u(undefined, "") },
        { json: "Action", js: "Action", typ: u(undefined, "") },
        { json: "ExecutedBy", js: "ExecutedBy", typ: u(undefined, "") },
        { json: "window-target-id", js: "window-target-id", typ: u(undefined, "") },
        { json: "window-id", js: "window-id", typ: u(undefined, "") },
        { json: "start-time", js: "start-time", typ: u(undefined, Date) },
        { json: "end-time", js: "end-time", typ: u(undefined, Date) },
        { json: "window-execution-id", js: "window-execution-id", typ: u(undefined, "") },
        { json: "task-execution-id", js: "task-execution-id", typ: u(undefined, "") },
        { json: "owner-information", js: "owner-information", typ: u(undefined, "") },
        { json: "window-task-id", js: "window-task-id", typ: u(undefined, "") },
        { json: "operation", js: "operation", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "policy-type", js: "policy-type", typ: u(undefined, "") },
        { json: "parameter-name", js: "parameter-name", typ: u(undefined, "") },
        { json: "parameter-type", js: "parameter-type", typ: u(undefined, "") },
        { json: "policy-content", js: "policy-content", typ: u(undefined, "") },
        { json: "action-status", js: "action-status", typ: u(undefined, "") },
        { json: "action-reason", js: "action-reason", typ: u(undefined, "") },
        { json: "association-id", js: "association-id", typ: u(undefined, "") },
        { json: "association-version", js: "association-version", typ: u(undefined, "") },
        { json: "document-version", js: "document-version", typ: u(undefined, "") },
        { json: "targets", js: "targets", typ: u(undefined, "") },
        { json: "creation-date", js: "creation-date", typ: u(undefined, Date) },
        { json: "last-successful-execution-date", js: "last-successful-execution-date", typ: u(undefined, Date) },
        { json: "last-execution-date", js: "last-execution-date", typ: u(undefined, Date) },
        { json: "last-updated-date", js: "last-updated-date", typ: u(undefined, Date) },
        { json: "association-status-aggregated-count", js: "association-status-aggregated-count", typ: u(undefined, "") },
        { json: "schedule-expression", js: "schedule-expression", typ: u(undefined, "") },
        { json: "association-cwe-version", js: "association-cwe-version", typ: u(undefined, "") },
        { json: "detailed-status", js: "detailed-status", typ: u(undefined, "") },
        { json: "error-code", js: "error-code", typ: u(undefined, "") },
        { json: "execution-summary", js: "execution-summary", typ: u(undefined, "") },
        { json: "output-url", js: "output-url", typ: u(undefined, "") },
        { json: "instance-association-cwe-version", js: "instance-association-cwe-version", typ: u(undefined, "") },
        { json: "last-runtime", js: "last-runtime", typ: u(undefined, Date) },
        { json: "compliance-status", js: "compliance-status", typ: u(undefined, "") },
        { json: "resource-type", js: "resource-type", typ: u(undefined, "") },
        { json: "resource-id", js: "resource-id", typ: u(undefined, "") },
        { json: "compliance-type", js: "compliance-type", typ: u(undefined, "") },
        { json: "patch-baseline-id", js: "patch-baseline-id", typ: u(undefined, "") },
        { json: "severity", js: "severity", typ: u(undefined, "") },
        { json: "state", js: "state", typ: u(undefined, "") },
        { json: "atTime", js: "atTime", typ: u(undefined, Date) },
        { json: "event", js: "event", typ: u(undefined, "") },
        { json: "nextTransitionTime", js: "nextTransitionTime", typ: u(undefined, Date) },
    ], false),
    "Parameters": o([
        { json: "executionTimeout", js: "executionTimeout", typ: a("") },
        { json: "commands", js: "commands", typ: a("") },
    ], false),
    "DocumentName": [
        "AWS-RunPowerShellScript",
        "my-custom-document",
    ],
    "Region": [
        "us-east-1",
        "us-west-1",
        "us-west-2",
    ],
    "Source": [
        "aws.ssm",
    ],
};
