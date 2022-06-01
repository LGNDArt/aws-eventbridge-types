// To parse this data:
//
//   import { Convert, AwsXray } from "./file";
//
//   const awsXray = Convert.toAwsXray(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsXray {
    $schema:     string;
    type:        string;
    items:       DetailClass;
    definitions: Definitions;
}

export interface Definitions {
    AwsXrayElement:          AwsXrayElement;
    Detail:                  Detail;
    RequestImpactStatistics: RequestImpactStatistics;
    Event:                   Event;
    TopAnomalousService:     TopAnomalousService;
    ServiceID:               ServiceID;
}

export interface AwsXrayElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsXrayElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsXrayElementProperties {
    version:       ID;
    account:       Account;
    resources:     Resources;
    region:        Account;
    time:          ID;
    id:            ID;
    source:        Account;
    "detail-type": Account;
    detail:        DetailClass;
}

export interface Account {
    type: Type;
}

export enum Type {
    Integer = "integer",
    Null = "null",
    String = "string",
}

export interface DetailClass {
    $ref: string;
}

export interface ID {
    type:   Type;
    format: string;
}

export interface Resources {
    type:  string;
    items: ResourcesItems;
}

export interface ResourcesItems {
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             string[];
    title:                string;
}

export interface DetailProperties {
    InsightId:                               ID;
    Summary:                                 Account;
    GroupName:                               Account;
    RootCauseServiceId:                      DetailClass;
    Categories:                              Categories;
    State:                                   Account;
    StartTime:                               Account;
    EndTime:                                 Account;
    ClientRequestImpactStatistics:           DetailClass;
    RootCauseServiceRequestImpactStatistics: DetailClass;
    TopAnomalousServices:                    TopAnomalousServices;
    Event:                                   DetailClass;
}

export interface Categories {
    type:  string;
    items: Account;
}

export interface TopAnomalousServices {
    type:  string;
    items: DetailClass;
}

export interface Event {
    type:                 string;
    additionalProperties: boolean;
    properties:           EventProperties;
    required:             string[];
    title:                string;
}

export interface EventProperties {
    Summary:                                 Account;
    EventTime:                               Account;
    ClientRequestImpactStatistics:           DetailClass;
    RootCauseServiceRequestImpactStatistics: DetailClass;
    TopAnomalousServices:                    TopAnomalousServices;
}

export interface RequestImpactStatistics {
    type:                 string;
    additionalProperties: boolean;
    properties:           RequestImpactStatisticsProperties;
    required:             string[];
    title:                string;
}

export interface RequestImpactStatisticsProperties {
    FaultCount: Account;
    OkCount:    Account;
    TotalCount: Account;
}

export interface ServiceID {
    type:                 string;
    additionalProperties: boolean;
    properties:           ServiceIDProperties;
    required:             string[];
    title:                string;
}

export interface ServiceIDProperties {
    Type:      Account;
    Name:      Account;
    Names:     Resources;
    AccountId: Account;
}

export interface TopAnomalousService {
    type:                 string;
    additionalProperties: boolean;
    properties:           TopAnomalousServiceProperties;
    required:             string[];
    title:                string;
}

export interface TopAnomalousServiceProperties {
    ServiceId: DetailClass;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsXray(json: string): AwsXray {
        return cast(JSON.parse(json), r("AwsXray"));
    }

    public static awsXrayToJson(value: AwsXray): string {
        return JSON.stringify(uncast(value, r("AwsXray")), null, 2);
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
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsXrayElement", js: "AwsXrayElement", typ: r("AwsXrayElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "RequestImpactStatistics", js: "RequestImpactStatistics", typ: r("RequestImpactStatistics") },
        { json: "Event", js: "Event", typ: r("Event") },
        { json: "TopAnomalousService", js: "TopAnomalousService", typ: r("TopAnomalousService") },
        { json: "ServiceID", js: "ServiceID", typ: r("ServiceID") },
    ], false),
    "AwsXrayElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsXrayElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsXrayElementProperties": o([
        { json: "version", js: "version", typ: r("ID") },
        { json: "account", js: "account", typ: r("Account") },
        { json: "resources", js: "resources", typ: r("Resources") },
        { json: "region", js: "region", typ: r("Account") },
        { json: "time", js: "time", typ: r("ID") },
        { json: "id", js: "id", typ: r("ID") },
        { json: "source", js: "source", typ: r("Account") },
        { json: "detail-type", js: "detail-type", typ: r("Account") },
        { json: "detail", js: "detail", typ: r("DetailClass") },
    ], false),
    "Account": o([
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "DetailClass": o([
        { json: "$ref", js: "$ref", typ: "" },
    ], false),
    "ID": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: "" },
    ], false),
    "Resources": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("ResourcesItems") },
    ], false),
    "ResourcesItems": o([
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "InsightId", js: "InsightId", typ: r("ID") },
        { json: "Summary", js: "Summary", typ: r("Account") },
        { json: "GroupName", js: "GroupName", typ: r("Account") },
        { json: "RootCauseServiceId", js: "RootCauseServiceId", typ: r("DetailClass") },
        { json: "Categories", js: "Categories", typ: r("Categories") },
        { json: "State", js: "State", typ: r("Account") },
        { json: "StartTime", js: "StartTime", typ: r("Account") },
        { json: "EndTime", js: "EndTime", typ: r("Account") },
        { json: "ClientRequestImpactStatistics", js: "ClientRequestImpactStatistics", typ: r("DetailClass") },
        { json: "RootCauseServiceRequestImpactStatistics", js: "RootCauseServiceRequestImpactStatistics", typ: r("DetailClass") },
        { json: "TopAnomalousServices", js: "TopAnomalousServices", typ: r("TopAnomalousServices") },
        { json: "Event", js: "Event", typ: r("DetailClass") },
    ], false),
    "Categories": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Account") },
    ], false),
    "TopAnomalousServices": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
    ], false),
    "Event": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("EventProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "EventProperties": o([
        { json: "Summary", js: "Summary", typ: r("Account") },
        { json: "EventTime", js: "EventTime", typ: r("Account") },
        { json: "ClientRequestImpactStatistics", js: "ClientRequestImpactStatistics", typ: r("DetailClass") },
        { json: "RootCauseServiceRequestImpactStatistics", js: "RootCauseServiceRequestImpactStatistics", typ: r("DetailClass") },
        { json: "TopAnomalousServices", js: "TopAnomalousServices", typ: r("TopAnomalousServices") },
    ], false),
    "RequestImpactStatistics": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("RequestImpactStatisticsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "RequestImpactStatisticsProperties": o([
        { json: "FaultCount", js: "FaultCount", typ: r("Account") },
        { json: "OkCount", js: "OkCount", typ: r("Account") },
        { json: "TotalCount", js: "TotalCount", typ: r("Account") },
    ], false),
    "ServiceID": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ServiceIDProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ServiceIDProperties": o([
        { json: "Type", js: "Type", typ: r("Account") },
        { json: "Name", js: "Name", typ: r("Account") },
        { json: "Names", js: "Names", typ: r("Resources") },
        { json: "AccountId", js: "AccountId", typ: r("Account") },
    ], false),
    "TopAnomalousService": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("TopAnomalousServiceProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "TopAnomalousServiceProperties": o([
        { json: "ServiceId", js: "ServiceId", typ: r("DetailClass") },
    ], false),
    "Type": [
        "integer",
        "null",
        "string",
    ],
};
