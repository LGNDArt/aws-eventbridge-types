// To parse this data:
//
//   import { Convert, AwsDevopsGuru } from "./file";
//
//   const awsDevopsGuru = Convert.toAwsDevopsGuru(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsDevopsGuru {
    $schema:     string;
    type:        string;
    items:       DetailClass;
    definitions: Definitions;
}

export interface Definitions {
    AwsDevopsGuruElement: AwsDevopsGuruElement;
    Detail:               Detail;
    Anomaly:              Anomaly;
    SourceDetail:         SourceDetail;
    DataIdentifiers:      DataIdentifiers;
    Dimension:            Dimension;
    Recommendation:       Recommendation;
    RelatedAnomaly:       RelatedAnomaly;
    Resource:             Resource;
    SourceDetails:        SourceDetailsClass;
    CloudWatchMetric:     CloudWatchMetric;
    Dimensions:           Dimensions;
}

export interface Anomaly {
    type:                 string;
    additionalProperties: boolean;
    properties:           AnomalyProperties;
    required:             string[];
    title:                string;
}

export interface AnomalyProperties {
    startTime:     EndTime;
    id:            EndTime;
    sourceDetails: SourceDetails;
    endTime:       EndTime;
}

export interface EndTime {
    type: Type;
}

export enum Type {
    String = "string",
}

export interface SourceDetails {
    type:  string;
    items: DetailClass;
}

export interface DetailClass {
    $ref: string;
}

export interface AwsDevopsGuruElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsDevopsGuruElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsDevopsGuruElementProperties {
    version:       ID;
    id:            ID;
    "detail-type": EndTime;
    source:        EndTime;
    account:       EndTime;
    time:          ID;
    region:        EndTime;
    resources:     Resources;
    detail:        DetailClass;
}

export interface ID {
    type:   Type;
    format: string;
}

export interface Resources {
    type:  string;
    items: RelatedEventsItems;
}

export interface RelatedEventsItems {
}

export interface CloudWatchMetric {
    type:                 string;
    additionalProperties: boolean;
    properties:           CloudWatchMetricProperties;
    required:             string[];
    title:                string;
}

export interface CloudWatchMetricProperties {
    metricName: EndTime;
    namespace:  EndTime;
}

export interface DataIdentifiers {
    type:                 string;
    additionalProperties: boolean;
    properties:           DataIdentifiersProperties;
    required:             string[];
    title:                string;
}

export interface DataIdentifiersProperties {
    period:       ID;
    stat:         EndTime;
    unit:         EndTime;
    name:         EndTime;
    namespace:    EndTime;
    dimensions:   DetailClass;
    ResourceId:   EndTime;
    ResourceType: EndTime;
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             string[];
    title:                string;
}

export interface DetailProperties {
    insightSeverity:    EndTime;
    insightDescription: EndTime;
    insightType:        EndTime;
    anomalies:          SourceDetails;
    accountId:          EndTime;
    messageType:        EndTime;
    insightUrl:         InsightURL;
    startTime:          EndTime;
    insightId:          EndTime;
    region:             EndTime;
    endTime:            EndTime;
    recommendations:    SourceDetails;
}

export interface InsightURL {
    type:                 Type;
    format:               string;
    "qt-uri-protocols":   string[];
    "qt-uri-extensions"?: string[];
}

export interface Dimension {
    type:                 string;
    additionalProperties: boolean;
    properties:           DimensionProperties;
    required:             string[];
    title:                string;
}

export interface DimensionProperties {
    name:  EndTime;
    value: EndTime;
}

export interface Dimensions {
    anyOf: AnyOf[];
    title: string;
}

export interface AnyOf {
    type?:  string;
    items?: DetailClass;
    $ref?:  string;
}

export interface Recommendation {
    type:                 string;
    additionalProperties: boolean;
    properties:           RecommendationProperties;
    required:             string[];
    title:                string;
}

export interface RecommendationProperties {
    name:             EndTime;
    description:      EndTime;
    reason:           EndTime;
    link:             InsightURL;
    relatedEvents:    Resources;
    relatedAnomalies: SourceDetails;
}

export interface RelatedAnomaly {
    type:                 string;
    additionalProperties: boolean;
    properties:           RelatedAnomalyProperties;
    required:             string[];
    title:                string;
}

export interface RelatedAnomalyProperties {
    sourceDetails: DetailClass;
    resources:     SourceDetails;
}

export interface Resource {
    type:                 string;
    additionalProperties: boolean;
    properties:           ResourceProperties;
    required:             string[];
    title:                string;
}

export interface ResourceProperties {
    name: EndTime;
    type: EndTime;
}

export interface SourceDetail {
    type:                 string;
    additionalProperties: boolean;
    properties:           SourceDetailProperties;
    required:             string[];
    title:                string;
}

export interface SourceDetailProperties {
    dataSource:      EndTime;
    dataIdentifiers: DetailClass;
}

export interface SourceDetailsClass {
    type:                 string;
    additionalProperties: boolean;
    properties:           SourceDetailsProperties;
    required:             string[];
    title:                string;
}

export interface SourceDetailsProperties {
    cloudWatchMetrics: SourceDetails;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsDevopsGuru(json: string): AwsDevopsGuru {
        return cast(JSON.parse(json), r("AwsDevopsGuru"));
    }

    public static awsDevopsGuruToJson(value: AwsDevopsGuru): string {
        return JSON.stringify(uncast(value, r("AwsDevopsGuru")), null, 2);
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
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsDevopsGuruElement", js: "AwsDevopsGuruElement", typ: r("AwsDevopsGuruElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "Anomaly", js: "Anomaly", typ: r("Anomaly") },
        { json: "SourceDetail", js: "SourceDetail", typ: r("SourceDetail") },
        { json: "DataIdentifiers", js: "DataIdentifiers", typ: r("DataIdentifiers") },
        { json: "Dimension", js: "Dimension", typ: r("Dimension") },
        { json: "Recommendation", js: "Recommendation", typ: r("Recommendation") },
        { json: "RelatedAnomaly", js: "RelatedAnomaly", typ: r("RelatedAnomaly") },
        { json: "Resource", js: "Resource", typ: r("Resource") },
        { json: "SourceDetails", js: "SourceDetails", typ: r("SourceDetailsClass") },
        { json: "CloudWatchMetric", js: "CloudWatchMetric", typ: r("CloudWatchMetric") },
        { json: "Dimensions", js: "Dimensions", typ: r("Dimensions") },
    ], false),
    "Anomaly": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AnomalyProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AnomalyProperties": o([
        { json: "startTime", js: "startTime", typ: r("EndTime") },
        { json: "id", js: "id", typ: r("EndTime") },
        { json: "sourceDetails", js: "sourceDetails", typ: r("SourceDetails") },
        { json: "endTime", js: "endTime", typ: r("EndTime") },
    ], false),
    "EndTime": o([
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "SourceDetails": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
    ], false),
    "DetailClass": o([
        { json: "$ref", js: "$ref", typ: "" },
    ], false),
    "AwsDevopsGuruElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsDevopsGuruElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsDevopsGuruElementProperties": o([
        { json: "version", js: "version", typ: r("ID") },
        { json: "id", js: "id", typ: r("ID") },
        { json: "detail-type", js: "detail-type", typ: r("EndTime") },
        { json: "source", js: "source", typ: r("EndTime") },
        { json: "account", js: "account", typ: r("EndTime") },
        { json: "time", js: "time", typ: r("ID") },
        { json: "region", js: "region", typ: r("EndTime") },
        { json: "resources", js: "resources", typ: r("Resources") },
        { json: "detail", js: "detail", typ: r("DetailClass") },
    ], false),
    "ID": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: "" },
    ], false),
    "Resources": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("RelatedEventsItems") },
    ], false),
    "RelatedEventsItems": o([
    ], false),
    "CloudWatchMetric": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("CloudWatchMetricProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "CloudWatchMetricProperties": o([
        { json: "metricName", js: "metricName", typ: r("EndTime") },
        { json: "namespace", js: "namespace", typ: r("EndTime") },
    ], false),
    "DataIdentifiers": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DataIdentifiersProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DataIdentifiersProperties": o([
        { json: "period", js: "period", typ: r("ID") },
        { json: "stat", js: "stat", typ: r("EndTime") },
        { json: "unit", js: "unit", typ: r("EndTime") },
        { json: "name", js: "name", typ: r("EndTime") },
        { json: "namespace", js: "namespace", typ: r("EndTime") },
        { json: "dimensions", js: "dimensions", typ: r("DetailClass") },
        { json: "ResourceId", js: "ResourceId", typ: r("EndTime") },
        { json: "ResourceType", js: "ResourceType", typ: r("EndTime") },
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "insightSeverity", js: "insightSeverity", typ: r("EndTime") },
        { json: "insightDescription", js: "insightDescription", typ: r("EndTime") },
        { json: "insightType", js: "insightType", typ: r("EndTime") },
        { json: "anomalies", js: "anomalies", typ: r("SourceDetails") },
        { json: "accountId", js: "accountId", typ: r("EndTime") },
        { json: "messageType", js: "messageType", typ: r("EndTime") },
        { json: "insightUrl", js: "insightUrl", typ: r("InsightURL") },
        { json: "startTime", js: "startTime", typ: r("EndTime") },
        { json: "insightId", js: "insightId", typ: r("EndTime") },
        { json: "region", js: "region", typ: r("EndTime") },
        { json: "endTime", js: "endTime", typ: r("EndTime") },
        { json: "recommendations", js: "recommendations", typ: r("SourceDetails") },
    ], false),
    "InsightURL": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: "" },
        { json: "qt-uri-protocols", js: "qt-uri-protocols", typ: a("") },
        { json: "qt-uri-extensions", js: "qt-uri-extensions", typ: u(undefined, a("")) },
    ], false),
    "Dimension": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DimensionProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DimensionProperties": o([
        { json: "name", js: "name", typ: r("EndTime") },
        { json: "value", js: "value", typ: r("EndTime") },
    ], false),
    "Dimensions": o([
        { json: "anyOf", js: "anyOf", typ: a(r("AnyOf")) },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AnyOf": o([
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "items", js: "items", typ: u(undefined, r("DetailClass")) },
        { json: "$ref", js: "$ref", typ: u(undefined, "") },
    ], false),
    "Recommendation": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("RecommendationProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "RecommendationProperties": o([
        { json: "name", js: "name", typ: r("EndTime") },
        { json: "description", js: "description", typ: r("EndTime") },
        { json: "reason", js: "reason", typ: r("EndTime") },
        { json: "link", js: "link", typ: r("InsightURL") },
        { json: "relatedEvents", js: "relatedEvents", typ: r("Resources") },
        { json: "relatedAnomalies", js: "relatedAnomalies", typ: r("SourceDetails") },
    ], false),
    "RelatedAnomaly": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("RelatedAnomalyProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "RelatedAnomalyProperties": o([
        { json: "sourceDetails", js: "sourceDetails", typ: r("DetailClass") },
        { json: "resources", js: "resources", typ: r("SourceDetails") },
    ], false),
    "Resource": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ResourceProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ResourceProperties": o([
        { json: "name", js: "name", typ: r("EndTime") },
        { json: "type", js: "type", typ: r("EndTime") },
    ], false),
    "SourceDetail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("SourceDetailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "SourceDetailProperties": o([
        { json: "dataSource", js: "dataSource", typ: r("EndTime") },
        { json: "dataIdentifiers", js: "dataIdentifiers", typ: r("DetailClass") },
    ], false),
    "SourceDetailsClass": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("SourceDetailsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "SourceDetailsProperties": o([
        { json: "cloudWatchMetrics", js: "cloudWatchMetrics", typ: r("SourceDetails") },
    ], false),
    "Type": [
        "string",
    ],
};
