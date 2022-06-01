// To parse this data:
//
//   import { Convert, AwsCodecommit } from "./file";
//
//   const awsCodecommit = Convert.toAwsCodecommit(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsCodecommit {
    $schema:     string;
    type:        string;
    items:       Items;
    definitions: Definitions;
}

export interface Definitions {
    AwsCodecommitElement: AwsCodecommitElement;
    Detail:               Detail;
    Repositories:         Repositories;
}

export interface AwsCodecommitElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsCodecommitElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsCodecommitElementProperties {
    version:       ID;
    id:            ID;
    "detail-type": Account;
    source:        Account;
    account:       Account;
    time:          ID;
    region:        Account;
    resources:     Resources;
    detail:        Items;
}

export interface Account {
    type: Type;
}

export enum Type {
    String = "string",
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
    items: Account;
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             string[];
    title:                string;
}

export interface DetailProperties {
    event:                             Account;
    repositoryName:                    Account;
    repositoryId:                      Account;
    referenceType:                     Account;
    referenceName:                     Account;
    referenceFullName:                 Account;
    commitId:                          Account;
    oldCommitId:                       Account;
    beforeCommitId:                    Account;
    inReplyTo:                         Account;
    notificationBody:                  Account;
    commentId:                         Account;
    afterCommitId:                     Account;
    callerUserArn:                     Account;
    pullRequestId:                     ID;
    sourceReference:                   Account;
    lastModifiedDate:                  Account;
    author:                            Account;
    pullRequestStatus:                 Account;
    isMerged:                          Account;
    destinationReference:              Account;
    title:                             Account;
    creationDate:                      Account;
    repositoryNames:                   Resources;
    destinationCommit:                 Account;
    sourceCommit:                      Account;
    approvalRuleTemplateContentSha256: Account;
    approvalRuleTemplateId:            ID;
    approvalRuleTemplateName:          Account;
    repositories:                      Items;
    reactionEmojis:                    Resources;
    reactionShortcodes:                Resources;
    reactionUnicodes:                  Resources;
}

export interface Repositories {
    type:                 string;
    additionalProperties: boolean;
    title:                string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsCodecommit(json: string): AwsCodecommit {
        return cast(JSON.parse(json), r("AwsCodecommit"));
    }

    public static awsCodecommitToJson(value: AwsCodecommit): string {
        return JSON.stringify(uncast(value, r("AwsCodecommit")), null, 2);
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
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Items") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsCodecommitElement", js: "AwsCodecommitElement", typ: r("AwsCodecommitElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "Repositories", js: "Repositories", typ: r("Repositories") },
    ], false),
    "AwsCodecommitElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsCodecommitElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsCodecommitElementProperties": o([
        { json: "version", js: "version", typ: r("ID") },
        { json: "id", js: "id", typ: r("ID") },
        { json: "detail-type", js: "detail-type", typ: r("Account") },
        { json: "source", js: "source", typ: r("Account") },
        { json: "account", js: "account", typ: r("Account") },
        { json: "time", js: "time", typ: r("ID") },
        { json: "region", js: "region", typ: r("Account") },
        { json: "resources", js: "resources", typ: r("Resources") },
        { json: "detail", js: "detail", typ: r("Items") },
    ], false),
    "Account": o([
        { json: "type", js: "type", typ: r("Type") },
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
        { json: "items", js: "items", typ: r("Account") },
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "event", js: "event", typ: r("Account") },
        { json: "repositoryName", js: "repositoryName", typ: r("Account") },
        { json: "repositoryId", js: "repositoryId", typ: r("Account") },
        { json: "referenceType", js: "referenceType", typ: r("Account") },
        { json: "referenceName", js: "referenceName", typ: r("Account") },
        { json: "referenceFullName", js: "referenceFullName", typ: r("Account") },
        { json: "commitId", js: "commitId", typ: r("Account") },
        { json: "oldCommitId", js: "oldCommitId", typ: r("Account") },
        { json: "beforeCommitId", js: "beforeCommitId", typ: r("Account") },
        { json: "inReplyTo", js: "inReplyTo", typ: r("Account") },
        { json: "notificationBody", js: "notificationBody", typ: r("Account") },
        { json: "commentId", js: "commentId", typ: r("Account") },
        { json: "afterCommitId", js: "afterCommitId", typ: r("Account") },
        { json: "callerUserArn", js: "callerUserArn", typ: r("Account") },
        { json: "pullRequestId", js: "pullRequestId", typ: r("ID") },
        { json: "sourceReference", js: "sourceReference", typ: r("Account") },
        { json: "lastModifiedDate", js: "lastModifiedDate", typ: r("Account") },
        { json: "author", js: "author", typ: r("Account") },
        { json: "pullRequestStatus", js: "pullRequestStatus", typ: r("Account") },
        { json: "isMerged", js: "isMerged", typ: r("Account") },
        { json: "destinationReference", js: "destinationReference", typ: r("Account") },
        { json: "title", js: "title", typ: r("Account") },
        { json: "creationDate", js: "creationDate", typ: r("Account") },
        { json: "repositoryNames", js: "repositoryNames", typ: r("Resources") },
        { json: "destinationCommit", js: "destinationCommit", typ: r("Account") },
        { json: "sourceCommit", js: "sourceCommit", typ: r("Account") },
        { json: "approvalRuleTemplateContentSha256", js: "approvalRuleTemplateContentSha256", typ: r("Account") },
        { json: "approvalRuleTemplateId", js: "approvalRuleTemplateId", typ: r("ID") },
        { json: "approvalRuleTemplateName", js: "approvalRuleTemplateName", typ: r("Account") },
        { json: "repositories", js: "repositories", typ: r("Items") },
        { json: "reactionEmojis", js: "reactionEmojis", typ: r("Resources") },
        { json: "reactionShortcodes", js: "reactionShortcodes", typ: r("Resources") },
        { json: "reactionUnicodes", js: "reactionUnicodes", typ: r("Resources") },
    ], false),
    "Repositories": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "title", js: "title", typ: "" },
    ], false),
    "Type": [
        "string",
    ],
};
