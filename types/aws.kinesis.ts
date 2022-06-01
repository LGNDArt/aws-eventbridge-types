// To parse this data:
//
//   import { Convert } from "./file";
//
//   const awsKinesis = Convert.toAwsKinesis(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsKinesis {
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
    eventVersion:                 string;
    userIdentity:                 UserIdentity;
    eventTime:                    Date;
    eventSource:                  string;
    eventName:                    string;
    awsRegion:                    string;
    sourceIPAddress:              string;
    userAgent:                    string;
    requestParameters:            RequestParameters;
    responseElements:             null;
    requestID:                    string;
    eventID:                      string;
    readOnly:                     boolean;
    eventType:                    string;
    managementEvent:              boolean;
    recipientAccountId:           string;
    eventCategory:                string;
    sessionCredentialFromConsole: string;
}

export interface RequestParameters {
    streamARN:         string;
    streamModeDetails: StreamModeDetails;
}

export interface StreamModeDetails {
    streamMode: string;
}

export interface UserIdentity {
    type:           string;
    principalId:    string;
    arn:            string;
    accountId:      string;
    accessKeyId:    string;
    sessionContext: SessionContext;
}

export interface SessionContext {
    sessionIssuer:       SessionIssuer;
    webIdFederationData: WebIDFederationData;
    attributes:          Attributes;
}

export interface Attributes {
    creationDate:     Date;
    mfaAuthenticated: string;
}

export interface SessionIssuer {
    type:        string;
    principalId: string;
    arn:         string;
    accountId:   string;
    userName:    string;
}

export interface WebIDFederationData {
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsKinesis(json: string): AwsKinesis[] {
        return cast(JSON.parse(json), a(r("AwsKinesis")));
    }

    public static awsKinesisToJson(value: AwsKinesis[]): string {
        return JSON.stringify(uncast(value, a(r("AwsKinesis"))), null, 2);
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
    "AwsKinesis": o([
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
        { json: "eventVersion", js: "eventVersion", typ: "" },
        { json: "userIdentity", js: "userIdentity", typ: r("UserIdentity") },
        { json: "eventTime", js: "eventTime", typ: Date },
        { json: "eventSource", js: "eventSource", typ: "" },
        { json: "eventName", js: "eventName", typ: "" },
        { json: "awsRegion", js: "awsRegion", typ: "" },
        { json: "sourceIPAddress", js: "sourceIPAddress", typ: "" },
        { json: "userAgent", js: "userAgent", typ: "" },
        { json: "requestParameters", js: "requestParameters", typ: r("RequestParameters") },
        { json: "responseElements", js: "responseElements", typ: null },
        { json: "requestID", js: "requestID", typ: "" },
        { json: "eventID", js: "eventID", typ: "" },
        { json: "readOnly", js: "readOnly", typ: true },
        { json: "eventType", js: "eventType", typ: "" },
        { json: "managementEvent", js: "managementEvent", typ: true },
        { json: "recipientAccountId", js: "recipientAccountId", typ: "" },
        { json: "eventCategory", js: "eventCategory", typ: "" },
        { json: "sessionCredentialFromConsole", js: "sessionCredentialFromConsole", typ: "" },
    ], false),
    "RequestParameters": o([
        { json: "streamARN", js: "streamARN", typ: "" },
        { json: "streamModeDetails", js: "streamModeDetails", typ: r("StreamModeDetails") },
    ], false),
    "StreamModeDetails": o([
        { json: "streamMode", js: "streamMode", typ: "" },
    ], false),
    "UserIdentity": o([
        { json: "type", js: "type", typ: "" },
        { json: "principalId", js: "principalId", typ: "" },
        { json: "arn", js: "arn", typ: "" },
        { json: "accountId", js: "accountId", typ: "" },
        { json: "accessKeyId", js: "accessKeyId", typ: "" },
        { json: "sessionContext", js: "sessionContext", typ: r("SessionContext") },
    ], false),
    "SessionContext": o([
        { json: "sessionIssuer", js: "sessionIssuer", typ: r("SessionIssuer") },
        { json: "webIdFederationData", js: "webIdFederationData", typ: r("WebIDFederationData") },
        { json: "attributes", js: "attributes", typ: r("Attributes") },
    ], false),
    "Attributes": o([
        { json: "creationDate", js: "creationDate", typ: Date },
        { json: "mfaAuthenticated", js: "mfaAuthenticated", typ: "" },
    ], false),
    "SessionIssuer": o([
        { json: "type", js: "type", typ: "" },
        { json: "principalId", js: "principalId", typ: "" },
        { json: "arn", js: "arn", typ: "" },
        { json: "accountId", js: "accountId", typ: "" },
        { json: "userName", js: "userName", typ: "" },
    ], false),
    "WebIDFederationData": o([
    ], false),
};
