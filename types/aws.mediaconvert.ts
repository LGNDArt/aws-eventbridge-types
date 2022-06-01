// To parse this data:
//
//   import { Convert, AwsMediaconvert } from "./file";
//
//   const awsMediaconvert = Convert.toAwsMediaconvert(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsMediaconvert {
    $schema:     string;
    type:        string;
    items:       Items;
    definitions: Definitions;
}

export interface Definitions {
    AwsMediaconvertElement: AwsMediaconvertElement;
    Detail:                 Detail;
    InputDetail:            InputDetail;
    Audio:                  Audio;
    Video:                  Video;
    OutputGroupDetail:      OutputGroupDetail;
    OutputDetail:           OutputDetail;
    VideoDetails:           VideoDetails;
    UserMetadata:           UserMetadata;
}

export interface Audio {
    type:                 string;
    additionalProperties: boolean;
    properties:           AudioProperties;
    required:             string[];
    title:                string;
}

export interface AudioProperties {
    streamId:   Channels;
    codec:      Channels;
    channels:   Channels;
    sampleRate: Channels;
    language:   Channels;
}

export interface Channels {
    type: Type;
}

export enum Type {
    Integer = "integer",
    Null = "null",
    Number = "number",
    String = "string",
}

export interface AwsMediaconvertElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsMediaconvertElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsMediaconvertElementProperties {
    version:       ID;
    id:            ID;
    "detail-type": Channels;
    source:        Channels;
    account:       Channels;
    time:          ID;
    region:        Channels;
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
    items: Channels;
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             string[];
    title:                string;
}

export interface DetailProperties {
    timestamp:          Channels;
    accountId:          Channels;
    queue:              Channels;
    jobId:              Channels;
    status:             Channels;
    userMetadata:       Items;
    inputDetails:       InputDetails;
    outputGroupDetails: InputDetails;
}

export interface InputDetails {
    type:  string;
    items: Items;
}

export interface InputDetail {
    type:                 string;
    additionalProperties: boolean;
    properties:           InputDetailProperties;
    required:             string[];
    title:                string;
}

export interface InputDetailProperties {
    id:    Channels;
    uri:   Channels;
    video: InputDetails;
    audio: InputDetails;
    data:  Channels;
}

export interface OutputDetail {
    type:                 string;
    additionalProperties: boolean;
    properties:           OutputDetailProperties;
    required:             string[];
    title:                string;
}

export interface OutputDetailProperties {
    durationInMs: Channels;
    videoDetails: Items;
}

export interface OutputGroupDetail {
    type:                 string;
    additionalProperties: boolean;
    properties:           OutputGroupDetailProperties;
    required:             string[];
    title:                string;
}

export interface OutputGroupDetailProperties {
    outputDetails: InputDetails;
}

export interface UserMetadata {
    type:                 string;
    additionalProperties: boolean;
    title:                string;
}

export interface Video {
    type:                 string;
    additionalProperties: boolean;
    properties:           { [key: string]: Channels };
    required:             string[];
    title:                string;
}

export interface VideoDetails {
    type:                 string;
    additionalProperties: boolean;
    properties:           VideoDetailsProperties;
    required:             string[];
    title:                string;
}

export interface VideoDetailsProperties {
    widthInPx:  Channels;
    heightInPx: Channels;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsMediaconvert(json: string): AwsMediaconvert {
        return cast(JSON.parse(json), r("AwsMediaconvert"));
    }

    public static awsMediaconvertToJson(value: AwsMediaconvert): string {
        return JSON.stringify(uncast(value, r("AwsMediaconvert")), null, 2);
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
    "AwsMediaconvert": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Items") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsMediaconvertElement", js: "AwsMediaconvertElement", typ: r("AwsMediaconvertElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "InputDetail", js: "InputDetail", typ: r("InputDetail") },
        { json: "Audio", js: "Audio", typ: r("Audio") },
        { json: "Video", js: "Video", typ: r("Video") },
        { json: "OutputGroupDetail", js: "OutputGroupDetail", typ: r("OutputGroupDetail") },
        { json: "OutputDetail", js: "OutputDetail", typ: r("OutputDetail") },
        { json: "VideoDetails", js: "VideoDetails", typ: r("VideoDetails") },
        { json: "UserMetadata", js: "UserMetadata", typ: r("UserMetadata") },
    ], false),
    "Audio": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AudioProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AudioProperties": o([
        { json: "streamId", js: "streamId", typ: r("Channels") },
        { json: "codec", js: "codec", typ: r("Channels") },
        { json: "channels", js: "channels", typ: r("Channels") },
        { json: "sampleRate", js: "sampleRate", typ: r("Channels") },
        { json: "language", js: "language", typ: r("Channels") },
    ], false),
    "Channels": o([
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "AwsMediaconvertElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsMediaconvertElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsMediaconvertElementProperties": o([
        { json: "version", js: "version", typ: r("ID") },
        { json: "id", js: "id", typ: r("ID") },
        { json: "detail-type", js: "detail-type", typ: r("Channels") },
        { json: "source", js: "source", typ: r("Channels") },
        { json: "account", js: "account", typ: r("Channels") },
        { json: "time", js: "time", typ: r("ID") },
        { json: "region", js: "region", typ: r("Channels") },
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
        { json: "items", js: "items", typ: r("Channels") },
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "timestamp", js: "timestamp", typ: r("Channels") },
        { json: "accountId", js: "accountId", typ: r("Channels") },
        { json: "queue", js: "queue", typ: r("Channels") },
        { json: "jobId", js: "jobId", typ: r("Channels") },
        { json: "status", js: "status", typ: r("Channels") },
        { json: "userMetadata", js: "userMetadata", typ: r("Items") },
        { json: "inputDetails", js: "inputDetails", typ: r("InputDetails") },
        { json: "outputGroupDetails", js: "outputGroupDetails", typ: r("InputDetails") },
    ], false),
    "InputDetails": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Items") },
    ], false),
    "InputDetail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("InputDetailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "InputDetailProperties": o([
        { json: "id", js: "id", typ: r("Channels") },
        { json: "uri", js: "uri", typ: r("Channels") },
        { json: "video", js: "video", typ: r("InputDetails") },
        { json: "audio", js: "audio", typ: r("InputDetails") },
        { json: "data", js: "data", typ: r("Channels") },
    ], false),
    "OutputDetail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("OutputDetailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "OutputDetailProperties": o([
        { json: "durationInMs", js: "durationInMs", typ: r("Channels") },
        { json: "videoDetails", js: "videoDetails", typ: r("Items") },
    ], false),
    "OutputGroupDetail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("OutputGroupDetailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "OutputGroupDetailProperties": o([
        { json: "outputDetails", js: "outputDetails", typ: r("InputDetails") },
    ], false),
    "UserMetadata": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "title", js: "title", typ: "" },
    ], false),
    "Video": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: m(r("Channels")) },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "VideoDetails": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("VideoDetailsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "VideoDetailsProperties": o([
        { json: "widthInPx", js: "widthInPx", typ: r("Channels") },
        { json: "heightInPx", js: "heightInPx", typ: r("Channels") },
    ], false),
    "Type": [
        "integer",
        "null",
        "number",
        "string",
    ],
};
