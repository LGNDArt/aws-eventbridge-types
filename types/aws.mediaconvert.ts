// To parse this data:
//
//   import { Convert } from "./file";
//
//   const awsMediaconvert = Convert.toAwsMediaconvert(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsMediaconvert {
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
    timestamp:           number;
    accountId:           string;
    queue:               string;
    jobId:               string;
    status:              string;
    userMetadata:        UserMetadata;
    inputDetails?:       InputDetail[];
    outputGroupDetails?: OutputGroupDetail[];
}

export interface InputDetail {
    id:    number;
    uri:   string;
    video: Video[];
    audio: Audio[];
    data:  null;
}

export interface Audio {
    streamId:   number;
    codec:      string;
    channels:   number;
    sampleRate: number;
    language:   string;
}

export interface Video {
    streamId:      number;
    width:         number;
    height:        number;
    frameRate:     number;
    sar:           string;
    bitDepth:      number;
    interlaceMode: string;
    colorFormat:   string;
    standard:      string;
    fourCC:        string;
}

export interface OutputGroupDetail {
    outputDetails: OutputDetail[];
}

export interface OutputDetail {
    durationInMs: number;
    videoDetails: VideoDetails;
}

export interface VideoDetails {
    widthInPx:  number;
    heightInPx: number;
}

export interface UserMetadata {
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsMediaconvert(json: string): AwsMediaconvert[] {
        return cast(JSON.parse(json), a(r("AwsMediaconvert")));
    }

    public static awsMediaconvertToJson(value: AwsMediaconvert[]): string {
        return JSON.stringify(uncast(value, a(r("AwsMediaconvert"))), null, 2);
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
        { json: "timestamp", js: "timestamp", typ: 0 },
        { json: "accountId", js: "accountId", typ: "" },
        { json: "queue", js: "queue", typ: "" },
        { json: "jobId", js: "jobId", typ: "" },
        { json: "status", js: "status", typ: "" },
        { json: "userMetadata", js: "userMetadata", typ: r("UserMetadata") },
        { json: "inputDetails", js: "inputDetails", typ: u(undefined, a(r("InputDetail"))) },
        { json: "outputGroupDetails", js: "outputGroupDetails", typ: u(undefined, a(r("OutputGroupDetail"))) },
    ], false),
    "InputDetail": o([
        { json: "id", js: "id", typ: 0 },
        { json: "uri", js: "uri", typ: "" },
        { json: "video", js: "video", typ: a(r("Video")) },
        { json: "audio", js: "audio", typ: a(r("Audio")) },
        { json: "data", js: "data", typ: null },
    ], false),
    "Audio": o([
        { json: "streamId", js: "streamId", typ: 0 },
        { json: "codec", js: "codec", typ: "" },
        { json: "channels", js: "channels", typ: 0 },
        { json: "sampleRate", js: "sampleRate", typ: 0 },
        { json: "language", js: "language", typ: "" },
    ], false),
    "Video": o([
        { json: "streamId", js: "streamId", typ: 0 },
        { json: "width", js: "width", typ: 0 },
        { json: "height", js: "height", typ: 0 },
        { json: "frameRate", js: "frameRate", typ: 3.14 },
        { json: "sar", js: "sar", typ: "" },
        { json: "bitDepth", js: "bitDepth", typ: 0 },
        { json: "interlaceMode", js: "interlaceMode", typ: "" },
        { json: "colorFormat", js: "colorFormat", typ: "" },
        { json: "standard", js: "standard", typ: "" },
        { json: "fourCC", js: "fourCC", typ: "" },
    ], false),
    "OutputGroupDetail": o([
        { json: "outputDetails", js: "outputDetails", typ: a(r("OutputDetail")) },
    ], false),
    "OutputDetail": o([
        { json: "durationInMs", js: "durationInMs", typ: 0 },
        { json: "videoDetails", js: "videoDetails", typ: r("VideoDetails") },
    ], false),
    "VideoDetails": o([
        { json: "widthInPx", js: "widthInPx", typ: 0 },
        { json: "heightInPx", js: "heightInPx", typ: 0 },
    ], false),
    "UserMetadata": o([
    ], false),
};
