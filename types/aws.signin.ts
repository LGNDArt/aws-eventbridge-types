// To parse this data:
//
//   import { Convert } from "./file";
//
//   const awsSignin = Convert.toAwsSignin(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsSignin {
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
    eventVersion:        string;
    userIdentity:        UserIdentity;
    eventTime:           Date;
    eventSource:         string;
    eventName:           string;
    awsRegion:           string;
    sourceIPAddress:     string;
    userAgent:           string;
    requestParameters:   null;
    responseElements:    ResponseElements;
    additionalEventData: AdditionalEventData;
    eventID:             string;
    eventType:           string;
}

export interface AdditionalEventData {
    LoginTo:       string;
    MobileVersion: string;
    MFAUsed:       string;
}

export interface ResponseElements {
    ConsoleLogin: string;
}

export interface UserIdentity {
    type:        string;
    principalId: string;
    arn:         string;
    accountId:   string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsSignin(json: string): AwsSignin[] {
        return cast(JSON.parse(json), a(r("AwsSignin")));
    }

    public static awsSigninToJson(value: AwsSignin[]): string {
        return JSON.stringify(uncast(value, a(r("AwsSignin"))), null, 2);
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
    "AwsSignin": o([
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
        { json: "requestParameters", js: "requestParameters", typ: null },
        { json: "responseElements", js: "responseElements", typ: r("ResponseElements") },
        { json: "additionalEventData", js: "additionalEventData", typ: r("AdditionalEventData") },
        { json: "eventID", js: "eventID", typ: "" },
        { json: "eventType", js: "eventType", typ: "" },
    ], false),
    "AdditionalEventData": o([
        { json: "LoginTo", js: "LoginTo", typ: "" },
        { json: "MobileVersion", js: "MobileVersion", typ: "" },
        { json: "MFAUsed", js: "MFAUsed", typ: "" },
    ], false),
    "ResponseElements": o([
        { json: "ConsoleLogin", js: "ConsoleLogin", typ: "" },
    ], false),
    "UserIdentity": o([
        { json: "type", js: "type", typ: "" },
        { json: "principalId", js: "principalId", typ: "" },
        { json: "arn", js: "arn", typ: "" },
        { json: "accountId", js: "accountId", typ: "" },
    ], false),
};
