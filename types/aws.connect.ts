// To parse this data:
//
//   import { Convert, AwsConnect } from "./file";
//
//   const awsConnect = Convert.toAwsConnect(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsConnect {
    $schema:     string;
    type:        string;
    items:       Items;
    definitions: Definitions;
}

export interface Definitions {
    AwsConnectElement: AwsConnectElement;
    Detail:            Detail;
    AdditionalInfo:    AdditionalInfo;
    AgentInfo:         AgentInfo;
    QueueInfo:         QueueInfo;
}

export interface AdditionalInfo {
    type:                 string;
    additionalProperties: boolean;
    properties:           AdditionalInfoProperties;
    required:             string[];
    title:                string;
}

export interface AdditionalInfoProperties {
    contactFlowId: ContactFlowID;
}

export interface ContactFlowID {
    type: Type;
}

export enum Type {
    String = "string",
}

export interface AgentInfo {
    type:                 string;
    additionalProperties: boolean;
    properties:           AgentInfoProperties;
    required:             string[];
    title:                string;
}

export interface AgentInfoProperties {
    agentArn: ContactFlowID;
}

export interface AwsConnectElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsConnectElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsConnectElementProperties {
    version:       ID;
    id:            ID;
    source:        ContactFlowID;
    "detail-type": ContactFlowID;
    account:       ContactFlowID;
    time:          ID;
    region:        ContactFlowID;
    resources:     Resources;
    detail:        Items;
}

export interface Items {
    $ref: string;
}

export interface ID {
    type:   Type;
    format: string;
}

export interface Resources {
    type:  string;
    items: ContactFlowID;
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             any[];
    title:                string;
}

export interface DetailProperties {
    instance:          ContactFlowID;
    contact:           ContactFlowID;
    channel:           ContactFlowID;
    state:             ContactFlowID;
    reasonCode:        ContactFlowID;
    eventType:         ContactFlowID;
    contactId:         ID;
    initialContactId:  ID;
    previousContactId: ID;
    instanceArn:       ContactFlowID;
    initiationMethod:  ContactFlowID;
    queueInfo:         Items;
    agentInfo:         Items;
    version:           ContactFlowID;
    ruleName:          ContactFlowID;
    actionName:        ContactFlowID;
    contactArn:        ContactFlowID;
    agentArn:          ContactFlowID;
    queueArn:          ContactFlowID;
    ruleId:            ID;
    actionType:        ContactFlowID;
    triggerEvent:      ContactFlowID;
    error:             ContactFlowID;
    additionalInfo:    Items;
}

export interface QueueInfo {
    type:                 string;
    additionalProperties: boolean;
    properties:           QueueInfoProperties;
    required:             string[];
    title:                string;
}

export interface QueueInfoProperties {
    queueArn:  ContactFlowID;
    queueType: ContactFlowID;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsConnect(json: string): AwsConnect {
        return cast(JSON.parse(json), r("AwsConnect"));
    }

    public static awsConnectToJson(value: AwsConnect): string {
        return JSON.stringify(uncast(value, r("AwsConnect")), null, 2);
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
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Items") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsConnectElement", js: "AwsConnectElement", typ: r("AwsConnectElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "AdditionalInfo", js: "AdditionalInfo", typ: r("AdditionalInfo") },
        { json: "AgentInfo", js: "AgentInfo", typ: r("AgentInfo") },
        { json: "QueueInfo", js: "QueueInfo", typ: r("QueueInfo") },
    ], false),
    "AdditionalInfo": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AdditionalInfoProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AdditionalInfoProperties": o([
        { json: "contactFlowId", js: "contactFlowId", typ: r("ContactFlowID") },
    ], false),
    "ContactFlowID": o([
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "AgentInfo": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AgentInfoProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AgentInfoProperties": o([
        { json: "agentArn", js: "agentArn", typ: r("ContactFlowID") },
    ], false),
    "AwsConnectElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsConnectElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsConnectElementProperties": o([
        { json: "version", js: "version", typ: r("ID") },
        { json: "id", js: "id", typ: r("ID") },
        { json: "source", js: "source", typ: r("ContactFlowID") },
        { json: "detail-type", js: "detail-type", typ: r("ContactFlowID") },
        { json: "account", js: "account", typ: r("ContactFlowID") },
        { json: "time", js: "time", typ: r("ID") },
        { json: "region", js: "region", typ: r("ContactFlowID") },
        { json: "resources", js: "resources", typ: r("Resources") },
        { json: "detail", js: "detail", typ: r("Items") },
    ], false),
    "Items": o([
        { json: "$ref", js: "$ref", typ: "" },
    ], false),
    "ID": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: "" },
    ], false),
    "Resources": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("ContactFlowID") },
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("any") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "instance", js: "instance", typ: r("ContactFlowID") },
        { json: "contact", js: "contact", typ: r("ContactFlowID") },
        { json: "channel", js: "channel", typ: r("ContactFlowID") },
        { json: "state", js: "state", typ: r("ContactFlowID") },
        { json: "reasonCode", js: "reasonCode", typ: r("ContactFlowID") },
        { json: "eventType", js: "eventType", typ: r("ContactFlowID") },
        { json: "contactId", js: "contactId", typ: r("ID") },
        { json: "initialContactId", js: "initialContactId", typ: r("ID") },
        { json: "previousContactId", js: "previousContactId", typ: r("ID") },
        { json: "instanceArn", js: "instanceArn", typ: r("ContactFlowID") },
        { json: "initiationMethod", js: "initiationMethod", typ: r("ContactFlowID") },
        { json: "queueInfo", js: "queueInfo", typ: r("Items") },
        { json: "agentInfo", js: "agentInfo", typ: r("Items") },
        { json: "version", js: "version", typ: r("ContactFlowID") },
        { json: "ruleName", js: "ruleName", typ: r("ContactFlowID") },
        { json: "actionName", js: "actionName", typ: r("ContactFlowID") },
        { json: "contactArn", js: "contactArn", typ: r("ContactFlowID") },
        { json: "agentArn", js: "agentArn", typ: r("ContactFlowID") },
        { json: "queueArn", js: "queueArn", typ: r("ContactFlowID") },
        { json: "ruleId", js: "ruleId", typ: r("ID") },
        { json: "actionType", js: "actionType", typ: r("ContactFlowID") },
        { json: "triggerEvent", js: "triggerEvent", typ: r("ContactFlowID") },
        { json: "error", js: "error", typ: r("ContactFlowID") },
        { json: "additionalInfo", js: "additionalInfo", typ: r("Items") },
    ], false),
    "QueueInfo": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("QueueInfoProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "QueueInfoProperties": o([
        { json: "queueArn", js: "queueArn", typ: r("ContactFlowID") },
        { json: "queueType", js: "queueType", typ: r("ContactFlowID") },
    ], false),
    "Type": [
        "string",
    ],
};
