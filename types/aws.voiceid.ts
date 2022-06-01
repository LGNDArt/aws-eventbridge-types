// To parse this data:
//
//   import { Convert } from "./file";
//
//   const awsVoiceid = Convert.toAwsVoiceid(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsVoiceid {
    version:       string;
    account:       string;
    region:        Region;
    detail:        Detail;
    "detail-type": string;
    source:        Source;
    id:            string;
    time:          Date;
    resources:     string[];
}

export interface Detail {
    action:                string;
    domainId:              DomainID;
    errorInfo:             ErrorInfo | null;
    session?:              Session;
    status:                string;
    systemAttributes?:     SystemAttributes | null;
    sourceId:              string;
    data?:                 Data | null;
    generatedSpeakerId?:   null | string;
    generatedFraudsterId?: null | string;
    batchJobId?:           string;
    sessionId?:            string;
    sessionName?:          string;
}

export interface Data {
    enrollmentSource?:     string;
    enrollmentSourceId?:   string;
    enrollmentStatus?:     null | string;
    registrationSource?:   string;
    registrationSourceId?: string;
    registrationStatus?:   null | string;
    dataAccessRoleArn?:    string;
    inputDataConfig?:      InputDataConfig;
    outputDataConfig?:     OutputDataConfig;
    registrationConfig?:   RegistrationConfig;
    enrollmentConfig?:     EnrollmentConfig;
}

export interface EnrollmentConfig {
    existingEnrollmentAction: string;
    fraudDetectionConfig:     FraudDetectionConfig;
}

export interface FraudDetectionConfig {
    fraudDetectionAction:    string;
    fraudDetectionThreshold: number;
}

export interface InputDataConfig {
    s3Uri: string;
}

export interface OutputDataConfig {
    kmsKeyId: string;
    s3Uri:    string;
}

export interface RegistrationConfig {
    duplicateRegistrationAction:  string;
    fraudsterSimilarityThreshold: number;
}

export enum DomainID {
    The7777Aaaaaaaa77777777Aa = "7777aaaaaaaa77777777aa",
}

export interface ErrorInfo {
    errorCode:    number;
    errorMessage: string;
    errorType:    string;
}

export interface Session {
    authenticationAudioProgress?: TionAudioProgress;
    authenticationConfiguration?: AuthenticationConfigurationClass | null;
    enrollmentAudioProgress?:     EnrollmentAudioProgress;
    fraudDetectionAudioProgress?: TionAudioProgress;
    fraudDetectionConfiguration?: FraudDetectionConfigurationClass | null;
    generatedSpeakerId:           null | string;
    sessionId:                    string;
    sessionName:                  string;
    streamingConfiguration?:      StreamingConfiguration;
    authenticationResult?:        AuthenticationResult | null;
    fraudDetectionResult?:        FraudDetectionResult | null;
    streamingStatus?:             string;
}

export interface TionAudioProgress {
    audioAggregationEndedAt:   Date | null;
    audioAggregationStartedAt: Date;
}

export interface AuthenticationConfigurationClass {
    acceptanceThreshold: number;
}

export interface AuthenticationResult {
    audioAggregationEndedAt:   null;
    audioAggregationStartedAt: null;
    authenticationResultId:    string;
    configuration:             AuthenticationConfigurationClass;
    decision:                  string;
    score:                     null;
}

export interface EnrollmentAudioProgress {
    audioAggregationEndedAt:   Date | null;
    audioAggregationStartedAt: Date;
    audioAggregationStatus:    string;
}

export interface FraudDetectionConfigurationClass {
    riskThreshold: number;
}

export interface FraudDetectionResult {
    audioAggregationEndedAt:   null;
    audioAggregationStartedAt: null;
    configuration:             FraudDetectionConfigurationClass;
    decision:                  string;
    fraudDetectionResultId:    string;
    reasons:                   null;
    riskDetails:               null;
}

export interface StreamingConfiguration {
    authenticationMinimumSpeechInSeconds: number;
}

export interface SystemAttributes {
    "aws:connect:OriginalContactArn": string;
}

export enum Region {
    UsEast1 = "us-east-1",
}

export enum Source {
    AwsVoiceid = "aws.voiceid",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsVoiceid(json: string): AwsVoiceid[] {
        return cast(JSON.parse(json), a(r("AwsVoiceid")));
    }

    public static awsVoiceidToJson(value: AwsVoiceid[]): string {
        return JSON.stringify(uncast(value, a(r("AwsVoiceid"))), null, 2);
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
    "AwsVoiceid": o([
        { json: "version", js: "version", typ: "" },
        { json: "account", js: "account", typ: "" },
        { json: "region", js: "region", typ: r("Region") },
        { json: "detail", js: "detail", typ: r("Detail") },
        { json: "detail-type", js: "detail-type", typ: "" },
        { json: "source", js: "source", typ: r("Source") },
        { json: "id", js: "id", typ: "" },
        { json: "time", js: "time", typ: Date },
        { json: "resources", js: "resources", typ: a("") },
    ], false),
    "Detail": o([
        { json: "action", js: "action", typ: "" },
        { json: "domainId", js: "domainId", typ: r("DomainID") },
        { json: "errorInfo", js: "errorInfo", typ: u(r("ErrorInfo"), null) },
        { json: "session", js: "session", typ: u(undefined, r("Session")) },
        { json: "status", js: "status", typ: "" },
        { json: "systemAttributes", js: "systemAttributes", typ: u(undefined, u(r("SystemAttributes"), null)) },
        { json: "sourceId", js: "sourceId", typ: "" },
        { json: "data", js: "data", typ: u(undefined, u(r("Data"), null)) },
        { json: "generatedSpeakerId", js: "generatedSpeakerId", typ: u(undefined, u(null, "")) },
        { json: "generatedFraudsterId", js: "generatedFraudsterId", typ: u(undefined, u(null, "")) },
        { json: "batchJobId", js: "batchJobId", typ: u(undefined, "") },
        { json: "sessionId", js: "sessionId", typ: u(undefined, "") },
        { json: "sessionName", js: "sessionName", typ: u(undefined, "") },
    ], false),
    "Data": o([
        { json: "enrollmentSource", js: "enrollmentSource", typ: u(undefined, "") },
        { json: "enrollmentSourceId", js: "enrollmentSourceId", typ: u(undefined, "") },
        { json: "enrollmentStatus", js: "enrollmentStatus", typ: u(undefined, u(null, "")) },
        { json: "registrationSource", js: "registrationSource", typ: u(undefined, "") },
        { json: "registrationSourceId", js: "registrationSourceId", typ: u(undefined, "") },
        { json: "registrationStatus", js: "registrationStatus", typ: u(undefined, u(null, "")) },
        { json: "dataAccessRoleArn", js: "dataAccessRoleArn", typ: u(undefined, "") },
        { json: "inputDataConfig", js: "inputDataConfig", typ: u(undefined, r("InputDataConfig")) },
        { json: "outputDataConfig", js: "outputDataConfig", typ: u(undefined, r("OutputDataConfig")) },
        { json: "registrationConfig", js: "registrationConfig", typ: u(undefined, r("RegistrationConfig")) },
        { json: "enrollmentConfig", js: "enrollmentConfig", typ: u(undefined, r("EnrollmentConfig")) },
    ], false),
    "EnrollmentConfig": o([
        { json: "existingEnrollmentAction", js: "existingEnrollmentAction", typ: "" },
        { json: "fraudDetectionConfig", js: "fraudDetectionConfig", typ: r("FraudDetectionConfig") },
    ], false),
    "FraudDetectionConfig": o([
        { json: "fraudDetectionAction", js: "fraudDetectionAction", typ: "" },
        { json: "fraudDetectionThreshold", js: "fraudDetectionThreshold", typ: 0 },
    ], false),
    "InputDataConfig": o([
        { json: "s3Uri", js: "s3Uri", typ: "" },
    ], false),
    "OutputDataConfig": o([
        { json: "kmsKeyId", js: "kmsKeyId", typ: "" },
        { json: "s3Uri", js: "s3Uri", typ: "" },
    ], false),
    "RegistrationConfig": o([
        { json: "duplicateRegistrationAction", js: "duplicateRegistrationAction", typ: "" },
        { json: "fraudsterSimilarityThreshold", js: "fraudsterSimilarityThreshold", typ: 0 },
    ], false),
    "ErrorInfo": o([
        { json: "errorCode", js: "errorCode", typ: 0 },
        { json: "errorMessage", js: "errorMessage", typ: "" },
        { json: "errorType", js: "errorType", typ: "" },
    ], false),
    "Session": o([
        { json: "authenticationAudioProgress", js: "authenticationAudioProgress", typ: u(undefined, r("TionAudioProgress")) },
        { json: "authenticationConfiguration", js: "authenticationConfiguration", typ: u(undefined, u(r("AuthenticationConfigurationClass"), null)) },
        { json: "enrollmentAudioProgress", js: "enrollmentAudioProgress", typ: u(undefined, r("EnrollmentAudioProgress")) },
        { json: "fraudDetectionAudioProgress", js: "fraudDetectionAudioProgress", typ: u(undefined, r("TionAudioProgress")) },
        { json: "fraudDetectionConfiguration", js: "fraudDetectionConfiguration", typ: u(undefined, u(r("FraudDetectionConfigurationClass"), null)) },
        { json: "generatedSpeakerId", js: "generatedSpeakerId", typ: u(null, "") },
        { json: "sessionId", js: "sessionId", typ: "" },
        { json: "sessionName", js: "sessionName", typ: "" },
        { json: "streamingConfiguration", js: "streamingConfiguration", typ: u(undefined, r("StreamingConfiguration")) },
        { json: "authenticationResult", js: "authenticationResult", typ: u(undefined, u(r("AuthenticationResult"), null)) },
        { json: "fraudDetectionResult", js: "fraudDetectionResult", typ: u(undefined, u(r("FraudDetectionResult"), null)) },
        { json: "streamingStatus", js: "streamingStatus", typ: u(undefined, "") },
    ], false),
    "TionAudioProgress": o([
        { json: "audioAggregationEndedAt", js: "audioAggregationEndedAt", typ: u(Date, null) },
        { json: "audioAggregationStartedAt", js: "audioAggregationStartedAt", typ: Date },
    ], false),
    "AuthenticationConfigurationClass": o([
        { json: "acceptanceThreshold", js: "acceptanceThreshold", typ: 0 },
    ], false),
    "AuthenticationResult": o([
        { json: "audioAggregationEndedAt", js: "audioAggregationEndedAt", typ: null },
        { json: "audioAggregationStartedAt", js: "audioAggregationStartedAt", typ: null },
        { json: "authenticationResultId", js: "authenticationResultId", typ: "" },
        { json: "configuration", js: "configuration", typ: r("AuthenticationConfigurationClass") },
        { json: "decision", js: "decision", typ: "" },
        { json: "score", js: "score", typ: null },
    ], false),
    "EnrollmentAudioProgress": o([
        { json: "audioAggregationEndedAt", js: "audioAggregationEndedAt", typ: u(Date, null) },
        { json: "audioAggregationStartedAt", js: "audioAggregationStartedAt", typ: Date },
        { json: "audioAggregationStatus", js: "audioAggregationStatus", typ: "" },
    ], false),
    "FraudDetectionConfigurationClass": o([
        { json: "riskThreshold", js: "riskThreshold", typ: 0 },
    ], false),
    "FraudDetectionResult": o([
        { json: "audioAggregationEndedAt", js: "audioAggregationEndedAt", typ: null },
        { json: "audioAggregationStartedAt", js: "audioAggregationStartedAt", typ: null },
        { json: "configuration", js: "configuration", typ: r("FraudDetectionConfigurationClass") },
        { json: "decision", js: "decision", typ: "" },
        { json: "fraudDetectionResultId", js: "fraudDetectionResultId", typ: "" },
        { json: "reasons", js: "reasons", typ: null },
        { json: "riskDetails", js: "riskDetails", typ: null },
    ], false),
    "StreamingConfiguration": o([
        { json: "authenticationMinimumSpeechInSeconds", js: "authenticationMinimumSpeechInSeconds", typ: 0 },
    ], false),
    "SystemAttributes": o([
        { json: "aws:connect:OriginalContactArn", js: "aws:connect:OriginalContactArn", typ: "" },
    ], false),
    "DomainID": [
        "7777aaaaaaaa77777777aa",
    ],
    "Region": [
        "us-east-1",
    ],
    "Source": [
        "aws.voiceid",
    ],
};
