// To parse this data:
//
//   import { Convert } from "./file";
//
//   const awsCodebuild = Convert.toAwsCodebuild(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsCodebuild {
    version:       string;
    id:            string;
    "detail-type": DetailType;
    source:        Source;
    account:       string;
    time:          Date;
    region:        Region;
    resources:     string[];
    detail:        Detail;
}

export interface Detail {
    "build-status"?:                     string;
    "project-name":                      ProjectName;
    "build-id":                          string;
    "current-phase"?:                    string;
    "current-phase-context"?:            string;
    version:                             string;
    "completed-phase"?:                  string;
    "completed-phase-context"?:          string;
    "completed-phase-status"?:           string;
    "completed-phase-duration-seconds"?: string;
    "completed-phase-start"?:            string;
    "completed-phase-end"?:              string;
}

export enum ProjectName {
    SampleProjectName = "SampleProjectName",
}

export enum DetailType {
    CodeBuildBuildPhaseChange = "CodeBuild Build Phase Change",
    CodeBuildBuildStateChange = "CodeBuild Build State Change",
}

export enum Region {
    UsEast1 = "us-east-1",
}

export enum Source {
    AwsCodebuild = "aws.codebuild",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsCodebuild(json: string): AwsCodebuild[] {
        return cast(JSON.parse(json), a(r("AwsCodebuild")));
    }

    public static awsCodebuildToJson(value: AwsCodebuild[]): string {
        return JSON.stringify(uncast(value, a(r("AwsCodebuild"))), null, 2);
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
    "AwsCodebuild": o([
        { json: "version", js: "version", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "detail-type", js: "detail-type", typ: r("DetailType") },
        { json: "source", js: "source", typ: r("Source") },
        { json: "account", js: "account", typ: "" },
        { json: "time", js: "time", typ: Date },
        { json: "region", js: "region", typ: r("Region") },
        { json: "resources", js: "resources", typ: a("") },
        { json: "detail", js: "detail", typ: r("Detail") },
    ], false),
    "Detail": o([
        { json: "build-status", js: "build-status", typ: u(undefined, "") },
        { json: "project-name", js: "project-name", typ: r("ProjectName") },
        { json: "build-id", js: "build-id", typ: "" },
        { json: "current-phase", js: "current-phase", typ: u(undefined, "") },
        { json: "current-phase-context", js: "current-phase-context", typ: u(undefined, "") },
        { json: "version", js: "version", typ: "" },
        { json: "completed-phase", js: "completed-phase", typ: u(undefined, "") },
        { json: "completed-phase-context", js: "completed-phase-context", typ: u(undefined, "") },
        { json: "completed-phase-status", js: "completed-phase-status", typ: u(undefined, "") },
        { json: "completed-phase-duration-seconds", js: "completed-phase-duration-seconds", typ: u(undefined, "") },
        { json: "completed-phase-start", js: "completed-phase-start", typ: u(undefined, "") },
        { json: "completed-phase-end", js: "completed-phase-end", typ: u(undefined, "") },
    ], false),
    "ProjectName": [
        "SampleProjectName",
    ],
    "DetailType": [
        "CodeBuild Build Phase Change",
        "CodeBuild Build State Change",
    ],
    "Region": [
        "us-east-1",
    ],
    "Source": [
        "aws.codebuild",
    ],
};
