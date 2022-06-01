// To parse this data:
//
//   import { Convert } from "./file";
//
//   const awsCodecommit = Convert.toAwsCodecommit(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsCodecommit {
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
    event:                              string;
    repositoryName?:                    string;
    repositoryId?:                      string;
    referenceType?:                     string;
    referenceName?:                     string;
    referenceFullName?:                 string;
    commitId?:                          string;
    oldCommitId?:                       string;
    beforeCommitId?:                    string;
    inReplyTo?:                         string;
    notificationBody?:                  string;
    commentId?:                         string;
    afterCommitId?:                     string;
    callerUserArn?:                     string;
    pullRequestId?:                     string;
    sourceReference?:                   string;
    lastModifiedDate?:                  string;
    author?:                            string;
    pullRequestStatus?:                 string;
    isMerged?:                          string;
    destinationReference?:              string;
    title?:                             string;
    creationDate?:                      string;
    repositoryNames?:                   string[];
    destinationCommit?:                 string;
    sourceCommit?:                      string;
    approvalRuleTemplateContentSha256?: string;
    approvalRuleTemplateId?:            string;
    approvalRuleTemplateName?:          string;
    repositories?:                      Repositories;
    reactionEmojis?:                    string[];
    reactionShortcodes?:                string[];
    reactionUnicodes?:                  string[];
}

export interface Repositories {
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsCodecommit(json: string): AwsCodecommit[] {
        return cast(JSON.parse(json), a(r("AwsCodecommit")));
    }

    public static awsCodecommitToJson(value: AwsCodecommit[]): string {
        return JSON.stringify(uncast(value, a(r("AwsCodecommit"))), null, 2);
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
    "AwsCodecommit": o([
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
        { json: "event", js: "event", typ: "" },
        { json: "repositoryName", js: "repositoryName", typ: u(undefined, "") },
        { json: "repositoryId", js: "repositoryId", typ: u(undefined, "") },
        { json: "referenceType", js: "referenceType", typ: u(undefined, "") },
        { json: "referenceName", js: "referenceName", typ: u(undefined, "") },
        { json: "referenceFullName", js: "referenceFullName", typ: u(undefined, "") },
        { json: "commitId", js: "commitId", typ: u(undefined, "") },
        { json: "oldCommitId", js: "oldCommitId", typ: u(undefined, "") },
        { json: "beforeCommitId", js: "beforeCommitId", typ: u(undefined, "") },
        { json: "inReplyTo", js: "inReplyTo", typ: u(undefined, "") },
        { json: "notificationBody", js: "notificationBody", typ: u(undefined, "") },
        { json: "commentId", js: "commentId", typ: u(undefined, "") },
        { json: "afterCommitId", js: "afterCommitId", typ: u(undefined, "") },
        { json: "callerUserArn", js: "callerUserArn", typ: u(undefined, "") },
        { json: "pullRequestId", js: "pullRequestId", typ: u(undefined, "") },
        { json: "sourceReference", js: "sourceReference", typ: u(undefined, "") },
        { json: "lastModifiedDate", js: "lastModifiedDate", typ: u(undefined, "") },
        { json: "author", js: "author", typ: u(undefined, "") },
        { json: "pullRequestStatus", js: "pullRequestStatus", typ: u(undefined, "") },
        { json: "isMerged", js: "isMerged", typ: u(undefined, "") },
        { json: "destinationReference", js: "destinationReference", typ: u(undefined, "") },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "creationDate", js: "creationDate", typ: u(undefined, "") },
        { json: "repositoryNames", js: "repositoryNames", typ: u(undefined, a("")) },
        { json: "destinationCommit", js: "destinationCommit", typ: u(undefined, "") },
        { json: "sourceCommit", js: "sourceCommit", typ: u(undefined, "") },
        { json: "approvalRuleTemplateContentSha256", js: "approvalRuleTemplateContentSha256", typ: u(undefined, "") },
        { json: "approvalRuleTemplateId", js: "approvalRuleTemplateId", typ: u(undefined, "") },
        { json: "approvalRuleTemplateName", js: "approvalRuleTemplateName", typ: u(undefined, "") },
        { json: "repositories", js: "repositories", typ: u(undefined, r("Repositories")) },
        { json: "reactionEmojis", js: "reactionEmojis", typ: u(undefined, a("")) },
        { json: "reactionShortcodes", js: "reactionShortcodes", typ: u(undefined, a("")) },
        { json: "reactionUnicodes", js: "reactionUnicodes", typ: u(undefined, a("")) },
    ], false),
    "Repositories": o([
    ], false),
};
