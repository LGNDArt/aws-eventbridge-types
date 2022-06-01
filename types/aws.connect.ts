// To parse this data:
//
//   import { Convert } from "./file";
//
//   const awsConnect = Convert.toAwsConnect(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsConnect {
    version:       string;
    id:            string;
    source:        string;
    "detail-type": string;
    account:       string;
    time:          Date;
    region:        string;
    resources:     string[];
    detail:        Detail;
}

export interface Detail {
    instance?:          string;
    contact?:           string;
    channel?:           string;
    state?:             string;
    reasonCode?:        string;
    eventType?:         string;
    contactId?:         string;
    initialContactId?:  string;
    previousContactId?: string;
    instanceArn?:       string;
    initiationMethod?:  string;
    queueInfo?:         QueueInfo;
    agentInfo?:         AgentInfo;
    version?:           string;
    ruleName?:          string;
    actionName?:        string;
    contactArn?:        string;
    agentArn?:          string;
    queueArn?:          string;
    ruleId?:            string;
    actionType?:        string;
    triggerEvent?:      string;
    error?:             string;
    additionalInfo?:    AdditionalInfo;
}

export interface AdditionalInfo {
    contactFlowId: string;
}

export interface AgentInfo {
    agentArn: string;
}

export interface QueueInfo {
    queueArn:  string;
    queueType: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsConnect(json: string): AwsConnect[] {
        return cast(JSON.parse(json), a(r("AwsConnect")));
    }

    public static awsConnectToJson(value: AwsConnect[]): string {
        return JSON.stringify(uncast(value, a(r("AwsConnect"))), null, 2);
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
    "AwsConnect": o([
        { json: "version", js: "version", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "source", js: "source", typ: "" },
        { json: "detail-type", js: "detail-type", typ: "" },
        { json: "account", js: "account", typ: "" },
        { json: "time", js: "time", typ: Date },
        { json: "region", js: "region", typ: "" },
        { json: "resources", js: "resources", typ: a("") },
        { json: "detail", js: "detail", typ: r("Detail") },
    ], false),
    "Detail": o([
        { json: "instance", js: "instance", typ: u(undefined, "") },
        { json: "contact", js: "contact", typ: u(undefined, "") },
        { json: "channel", js: "channel", typ: u(undefined, "") },
        { json: "state", js: "state", typ: u(undefined, "") },
        { json: "reasonCode", js: "reasonCode", typ: u(undefined, "") },
        { json: "eventType", js: "eventType", typ: u(undefined, "") },
        { json: "contactId", js: "contactId", typ: u(undefined, "") },
        { json: "initialContactId", js: "initialContactId", typ: u(undefined, "") },
        { json: "previousContactId", js: "previousContactId", typ: u(undefined, "") },
        { json: "instanceArn", js: "instanceArn", typ: u(undefined, "") },
        { json: "initiationMethod", js: "initiationMethod", typ: u(undefined, "") },
        { json: "queueInfo", js: "queueInfo", typ: u(undefined, r("QueueInfo")) },
        { json: "agentInfo", js: "agentInfo", typ: u(undefined, r("AgentInfo")) },
        { json: "version", js: "version", typ: u(undefined, "") },
        { json: "ruleName", js: "ruleName", typ: u(undefined, "") },
        { json: "actionName", js: "actionName", typ: u(undefined, "") },
        { json: "contactArn", js: "contactArn", typ: u(undefined, "") },
        { json: "agentArn", js: "agentArn", typ: u(undefined, "") },
        { json: "queueArn", js: "queueArn", typ: u(undefined, "") },
        { json: "ruleId", js: "ruleId", typ: u(undefined, "") },
        { json: "actionType", js: "actionType", typ: u(undefined, "") },
        { json: "triggerEvent", js: "triggerEvent", typ: u(undefined, "") },
        { json: "error", js: "error", typ: u(undefined, "") },
        { json: "additionalInfo", js: "additionalInfo", typ: u(undefined, r("AdditionalInfo")) },
    ], false),
    "AdditionalInfo": o([
        { json: "contactFlowId", js: "contactFlowId", typ: "" },
    ], false),
    "AgentInfo": o([
        { json: "agentArn", js: "agentArn", typ: "" },
    ], false),
    "QueueInfo": o([
        { json: "queueArn", js: "queueArn", typ: "" },
        { json: "queueType", js: "queueType", typ: "" },
    ], false),
};
