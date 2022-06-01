// To parse this data:
//
//   import { Convert, AwsVoiceid } from "./file";
//
//   const awsVoiceid = Convert.toAwsVoiceid(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsVoiceid {
    $schema:     string;
    type:        string;
    items:       Items;
    definitions: Definitions;
}

export interface Definitions {
    AwsVoiceidElement:                AwsVoiceidElement;
    Detail:                           Detail;
    Data:                             Data;
    EnrollmentConfig:                 EnrollmentConfig;
    FraudDetectionConfig:             FraudDetectionConfig;
    InputDataConfig:                  InputDataConfig;
    OutputDataConfig:                 OutputDataConfig;
    RegistrationConfig:               RegistrationConfig;
    ErrorInfo:                        ErrorInfo;
    Session:                          Session;
    TionAudioProgress:                TionAudioProgress;
    AuthenticationConfigurationClass: AuthenticationConfigurationClass;
    AuthenticationResult:             AuthenticationResult;
    EnrollmentAudioProgress:          EnrollmentAudioProgress;
    FraudDetectionConfigurationClass: FraudDetectionConfigurationClass;
    FraudDetectionResult:             FraudDetectionResult;
    StreamingConfiguration:           StreamingConfiguration;
    SystemAttributes:                 SystemAttributes;
    IDUnion:                          IDUnion;
    DomainID:                         DomainID;
    IDEnum:                           DomainID;
    Region:                           DomainID;
    Source:                           DomainID;
}

export interface AuthenticationConfigurationClass {
    type:                 string;
    additionalProperties: boolean;
    properties:           AuthenticationConfigurationClassProperties;
    required:             string[];
    title:                string;
}

export interface AuthenticationConfigurationClassProperties {
    acceptanceThreshold: AcceptanceThreshold;
}

export interface AcceptanceThreshold {
    type: Type;
}

export enum Type {
    Integer = "integer",
    Null = "null",
    String = "string",
}

export interface AuthenticationResult {
    type:                 string;
    additionalProperties: boolean;
    properties:           AuthenticationResultProperties;
    required:             string[];
    title:                string;
}

export interface AuthenticationResultProperties {
    audioAggregationEndedAt:   AcceptanceThreshold;
    audioAggregationStartedAt: AcceptanceThreshold;
    authenticationResultId:    AcceptanceThreshold;
    configuration:             Items;
    decision:                  AcceptanceThreshold;
    score:                     AcceptanceThreshold;
}

export interface Items {
    $ref: string;
}

export interface AwsVoiceidElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsVoiceidElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsVoiceidElementProperties {
    version:       Time;
    account:       AcceptanceThreshold;
    region:        Items;
    detail:        Items;
    "detail-type": AcceptanceThreshold;
    source:        Items;
    id:            Items;
    time:          Time;
    resources:     Resources;
}

export interface Resources {
    type:  string;
    items: AcceptanceThreshold;
}

export interface Time {
    type:    Type;
    format?: string;
}

export interface Data {
    type:                 string;
    additionalProperties: boolean;
    properties:           DataProperties;
    required:             any[];
    title:                string;
}

export interface DataProperties {
    enrollmentSource:     AcceptanceThreshold;
    enrollmentSourceId:   AcceptanceThreshold;
    enrollmentStatus:     EnrollmentStatus;
    registrationSource:   AcceptanceThreshold;
    registrationSourceId: AcceptanceThreshold;
    registrationStatus:   EnrollmentStatus;
    dataAccessRoleArn:    AcceptanceThreshold;
    inputDataConfig:      Items;
    outputDataConfig:     Items;
    registrationConfig:   Items;
    enrollmentConfig:     Items;
}

export interface EnrollmentStatus {
    anyOf: AcceptanceThreshold[];
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             string[];
    title:                string;
}

export interface DetailProperties {
    action:               AcceptanceThreshold;
    domainId:             Items;
    errorInfo:            DataClass;
    session:              Items;
    status:               AcceptanceThreshold;
    systemAttributes:     DataClass;
    sourceId:             AcceptanceThreshold;
    data:                 DataClass;
    generatedSpeakerId:   EnrollmentStatus;
    generatedFraudsterId: EnrollmentStatus;
    batchJobId:           AcceptanceThreshold;
    sessionId:            AcceptanceThreshold;
    sessionName:          AcceptanceThreshold;
}

export interface DataClass {
    anyOf: DataAnyOf[];
}

export interface DataAnyOf {
    $ref?: string;
    type?: Type;
}

export interface DomainID {
    type:  Type;
    enum:  string[];
    title: string;
}

export interface EnrollmentAudioProgress {
    type:                 string;
    additionalProperties: boolean;
    properties:           EnrollmentAudioProgressProperties;
    required:             string[];
    title:                string;
}

export interface EnrollmentAudioProgressProperties {
    audioAggregationEndedAt:   AudioAggregationEndedAt;
    audioAggregationStartedAt: Time;
    audioAggregationStatus:    AcceptanceThreshold;
}

export interface AudioAggregationEndedAt {
    anyOf: Time[];
}

export interface EnrollmentConfig {
    type:                 string;
    additionalProperties: boolean;
    properties:           EnrollmentConfigProperties;
    required:             string[];
    title:                string;
}

export interface EnrollmentConfigProperties {
    existingEnrollmentAction: AcceptanceThreshold;
    fraudDetectionConfig:     Items;
}

export interface ErrorInfo {
    type:                 string;
    additionalProperties: boolean;
    properties:           ErrorInfoProperties;
    required:             string[];
    title:                string;
}

export interface ErrorInfoProperties {
    errorCode:    AcceptanceThreshold;
    errorMessage: AcceptanceThreshold;
    errorType:    AcceptanceThreshold;
}

export interface FraudDetectionConfig {
    type:                 string;
    additionalProperties: boolean;
    properties:           FraudDetectionConfigProperties;
    required:             string[];
    title:                string;
}

export interface FraudDetectionConfigProperties {
    fraudDetectionAction:    AcceptanceThreshold;
    fraudDetectionThreshold: AcceptanceThreshold;
}

export interface FraudDetectionConfigurationClass {
    type:                 string;
    additionalProperties: boolean;
    properties:           FraudDetectionConfigurationClassProperties;
    required:             string[];
    title:                string;
}

export interface FraudDetectionConfigurationClassProperties {
    riskThreshold: AcceptanceThreshold;
}

export interface FraudDetectionResult {
    type:                 string;
    additionalProperties: boolean;
    properties:           FraudDetectionResultProperties;
    required:             string[];
    title:                string;
}

export interface FraudDetectionResultProperties {
    audioAggregationEndedAt:   AcceptanceThreshold;
    audioAggregationStartedAt: AcceptanceThreshold;
    configuration:             Items;
    decision:                  AcceptanceThreshold;
    fraudDetectionResultId:    AcceptanceThreshold;
    reasons:                   AcceptanceThreshold;
    riskDetails:               AcceptanceThreshold;
}

export interface IDUnion {
    anyOf: IDUnionAnyOf[];
    title: string;
}

export interface IDUnionAnyOf {
    $ref?:   string;
    type?:   Type;
    format?: string;
}

export interface InputDataConfig {
    type:                 string;
    additionalProperties: boolean;
    properties:           InputDataConfigProperties;
    required:             string[];
    title:                string;
}

export interface InputDataConfigProperties {
    s3Uri: AcceptanceThreshold;
}

export interface OutputDataConfig {
    type:                 string;
    additionalProperties: boolean;
    properties:           OutputDataConfigProperties;
    required:             string[];
    title:                string;
}

export interface OutputDataConfigProperties {
    kmsKeyId: AcceptanceThreshold;
    s3Uri:    AcceptanceThreshold;
}

export interface RegistrationConfig {
    type:                 string;
    additionalProperties: boolean;
    properties:           RegistrationConfigProperties;
    required:             string[];
    title:                string;
}

export interface RegistrationConfigProperties {
    duplicateRegistrationAction:  AcceptanceThreshold;
    fraudsterSimilarityThreshold: AcceptanceThreshold;
}

export interface Session {
    type:                 string;
    additionalProperties: boolean;
    properties:           SessionProperties;
    required:             string[];
    title:                string;
}

export interface SessionProperties {
    authenticationAudioProgress: Items;
    authenticationConfiguration: DataClass;
    enrollmentAudioProgress:     Items;
    fraudDetectionAudioProgress: Items;
    fraudDetectionConfiguration: DataClass;
    generatedSpeakerId:          EnrollmentStatus;
    sessionId:                   AcceptanceThreshold;
    sessionName:                 AcceptanceThreshold;
    streamingConfiguration:      Items;
    authenticationResult:        DataClass;
    fraudDetectionResult:        DataClass;
    streamingStatus:             AcceptanceThreshold;
}

export interface StreamingConfiguration {
    type:                 string;
    additionalProperties: boolean;
    properties:           StreamingConfigurationProperties;
    required:             string[];
    title:                string;
}

export interface StreamingConfigurationProperties {
    authenticationMinimumSpeechInSeconds: AcceptanceThreshold;
}

export interface SystemAttributes {
    type:                 string;
    additionalProperties: boolean;
    properties:           SystemAttributesProperties;
    required:             string[];
    title:                string;
}

export interface SystemAttributesProperties {
    "aws:connect:OriginalContactArn": AcceptanceThreshold;
}

export interface TionAudioProgress {
    type:                 string;
    additionalProperties: boolean;
    properties:           TionAudioProgressProperties;
    required:             string[];
    title:                string;
}

export interface TionAudioProgressProperties {
    audioAggregationEndedAt:   AudioAggregationEndedAt;
    audioAggregationStartedAt: Time;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsVoiceid(json: string): AwsVoiceid {
        return cast(JSON.parse(json), r("AwsVoiceid"));
    }

    public static awsVoiceidToJson(value: AwsVoiceid): string {
        return JSON.stringify(uncast(value, r("AwsVoiceid")), null, 2);
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
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("Items") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsVoiceidElement", js: "AwsVoiceidElement", typ: r("AwsVoiceidElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "Data", js: "Data", typ: r("Data") },
        { json: "EnrollmentConfig", js: "EnrollmentConfig", typ: r("EnrollmentConfig") },
        { json: "FraudDetectionConfig", js: "FraudDetectionConfig", typ: r("FraudDetectionConfig") },
        { json: "InputDataConfig", js: "InputDataConfig", typ: r("InputDataConfig") },
        { json: "OutputDataConfig", js: "OutputDataConfig", typ: r("OutputDataConfig") },
        { json: "RegistrationConfig", js: "RegistrationConfig", typ: r("RegistrationConfig") },
        { json: "ErrorInfo", js: "ErrorInfo", typ: r("ErrorInfo") },
        { json: "Session", js: "Session", typ: r("Session") },
        { json: "TionAudioProgress", js: "TionAudioProgress", typ: r("TionAudioProgress") },
        { json: "AuthenticationConfigurationClass", js: "AuthenticationConfigurationClass", typ: r("AuthenticationConfigurationClass") },
        { json: "AuthenticationResult", js: "AuthenticationResult", typ: r("AuthenticationResult") },
        { json: "EnrollmentAudioProgress", js: "EnrollmentAudioProgress", typ: r("EnrollmentAudioProgress") },
        { json: "FraudDetectionConfigurationClass", js: "FraudDetectionConfigurationClass", typ: r("FraudDetectionConfigurationClass") },
        { json: "FraudDetectionResult", js: "FraudDetectionResult", typ: r("FraudDetectionResult") },
        { json: "StreamingConfiguration", js: "StreamingConfiguration", typ: r("StreamingConfiguration") },
        { json: "SystemAttributes", js: "SystemAttributes", typ: r("SystemAttributes") },
        { json: "IDUnion", js: "IDUnion", typ: r("IDUnion") },
        { json: "DomainID", js: "DomainID", typ: r("DomainID") },
        { json: "IDEnum", js: "IDEnum", typ: r("DomainID") },
        { json: "Region", js: "Region", typ: r("DomainID") },
        { json: "Source", js: "Source", typ: r("DomainID") },
    ], false),
    "AuthenticationConfigurationClass": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AuthenticationConfigurationClassProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AuthenticationConfigurationClassProperties": o([
        { json: "acceptanceThreshold", js: "acceptanceThreshold", typ: r("AcceptanceThreshold") },
    ], false),
    "AcceptanceThreshold": o([
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "AuthenticationResult": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AuthenticationResultProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AuthenticationResultProperties": o([
        { json: "audioAggregationEndedAt", js: "audioAggregationEndedAt", typ: r("AcceptanceThreshold") },
        { json: "audioAggregationStartedAt", js: "audioAggregationStartedAt", typ: r("AcceptanceThreshold") },
        { json: "authenticationResultId", js: "authenticationResultId", typ: r("AcceptanceThreshold") },
        { json: "configuration", js: "configuration", typ: r("Items") },
        { json: "decision", js: "decision", typ: r("AcceptanceThreshold") },
        { json: "score", js: "score", typ: r("AcceptanceThreshold") },
    ], false),
    "Items": o([
        { json: "$ref", js: "$ref", typ: "" },
    ], false),
    "AwsVoiceidElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsVoiceidElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsVoiceidElementProperties": o([
        { json: "version", js: "version", typ: r("Time") },
        { json: "account", js: "account", typ: r("AcceptanceThreshold") },
        { json: "region", js: "region", typ: r("Items") },
        { json: "detail", js: "detail", typ: r("Items") },
        { json: "detail-type", js: "detail-type", typ: r("AcceptanceThreshold") },
        { json: "source", js: "source", typ: r("Items") },
        { json: "id", js: "id", typ: r("Items") },
        { json: "time", js: "time", typ: r("Time") },
        { json: "resources", js: "resources", typ: r("Resources") },
    ], false),
    "Resources": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("AcceptanceThreshold") },
    ], false),
    "Time": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: u(undefined, "") },
    ], false),
    "Data": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DataProperties") },
        { json: "required", js: "required", typ: a("any") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DataProperties": o([
        { json: "enrollmentSource", js: "enrollmentSource", typ: r("AcceptanceThreshold") },
        { json: "enrollmentSourceId", js: "enrollmentSourceId", typ: r("AcceptanceThreshold") },
        { json: "enrollmentStatus", js: "enrollmentStatus", typ: r("EnrollmentStatus") },
        { json: "registrationSource", js: "registrationSource", typ: r("AcceptanceThreshold") },
        { json: "registrationSourceId", js: "registrationSourceId", typ: r("AcceptanceThreshold") },
        { json: "registrationStatus", js: "registrationStatus", typ: r("EnrollmentStatus") },
        { json: "dataAccessRoleArn", js: "dataAccessRoleArn", typ: r("AcceptanceThreshold") },
        { json: "inputDataConfig", js: "inputDataConfig", typ: r("Items") },
        { json: "outputDataConfig", js: "outputDataConfig", typ: r("Items") },
        { json: "registrationConfig", js: "registrationConfig", typ: r("Items") },
        { json: "enrollmentConfig", js: "enrollmentConfig", typ: r("Items") },
    ], false),
    "EnrollmentStatus": o([
        { json: "anyOf", js: "anyOf", typ: a(r("AcceptanceThreshold")) },
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "action", js: "action", typ: r("AcceptanceThreshold") },
        { json: "domainId", js: "domainId", typ: r("Items") },
        { json: "errorInfo", js: "errorInfo", typ: r("DataClass") },
        { json: "session", js: "session", typ: r("Items") },
        { json: "status", js: "status", typ: r("AcceptanceThreshold") },
        { json: "systemAttributes", js: "systemAttributes", typ: r("DataClass") },
        { json: "sourceId", js: "sourceId", typ: r("AcceptanceThreshold") },
        { json: "data", js: "data", typ: r("DataClass") },
        { json: "generatedSpeakerId", js: "generatedSpeakerId", typ: r("EnrollmentStatus") },
        { json: "generatedFraudsterId", js: "generatedFraudsterId", typ: r("EnrollmentStatus") },
        { json: "batchJobId", js: "batchJobId", typ: r("AcceptanceThreshold") },
        { json: "sessionId", js: "sessionId", typ: r("AcceptanceThreshold") },
        { json: "sessionName", js: "sessionName", typ: r("AcceptanceThreshold") },
    ], false),
    "DataClass": o([
        { json: "anyOf", js: "anyOf", typ: a(r("DataAnyOf")) },
    ], false),
    "DataAnyOf": o([
        { json: "$ref", js: "$ref", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, r("Type")) },
    ], false),
    "DomainID": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "enum", js: "enum", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "EnrollmentAudioProgress": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("EnrollmentAudioProgressProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "EnrollmentAudioProgressProperties": o([
        { json: "audioAggregationEndedAt", js: "audioAggregationEndedAt", typ: r("AudioAggregationEndedAt") },
        { json: "audioAggregationStartedAt", js: "audioAggregationStartedAt", typ: r("Time") },
        { json: "audioAggregationStatus", js: "audioAggregationStatus", typ: r("AcceptanceThreshold") },
    ], false),
    "AudioAggregationEndedAt": o([
        { json: "anyOf", js: "anyOf", typ: a(r("Time")) },
    ], false),
    "EnrollmentConfig": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("EnrollmentConfigProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "EnrollmentConfigProperties": o([
        { json: "existingEnrollmentAction", js: "existingEnrollmentAction", typ: r("AcceptanceThreshold") },
        { json: "fraudDetectionConfig", js: "fraudDetectionConfig", typ: r("Items") },
    ], false),
    "ErrorInfo": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ErrorInfoProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ErrorInfoProperties": o([
        { json: "errorCode", js: "errorCode", typ: r("AcceptanceThreshold") },
        { json: "errorMessage", js: "errorMessage", typ: r("AcceptanceThreshold") },
        { json: "errorType", js: "errorType", typ: r("AcceptanceThreshold") },
    ], false),
    "FraudDetectionConfig": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("FraudDetectionConfigProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "FraudDetectionConfigProperties": o([
        { json: "fraudDetectionAction", js: "fraudDetectionAction", typ: r("AcceptanceThreshold") },
        { json: "fraudDetectionThreshold", js: "fraudDetectionThreshold", typ: r("AcceptanceThreshold") },
    ], false),
    "FraudDetectionConfigurationClass": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("FraudDetectionConfigurationClassProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "FraudDetectionConfigurationClassProperties": o([
        { json: "riskThreshold", js: "riskThreshold", typ: r("AcceptanceThreshold") },
    ], false),
    "FraudDetectionResult": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("FraudDetectionResultProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "FraudDetectionResultProperties": o([
        { json: "audioAggregationEndedAt", js: "audioAggregationEndedAt", typ: r("AcceptanceThreshold") },
        { json: "audioAggregationStartedAt", js: "audioAggregationStartedAt", typ: r("AcceptanceThreshold") },
        { json: "configuration", js: "configuration", typ: r("Items") },
        { json: "decision", js: "decision", typ: r("AcceptanceThreshold") },
        { json: "fraudDetectionResultId", js: "fraudDetectionResultId", typ: r("AcceptanceThreshold") },
        { json: "reasons", js: "reasons", typ: r("AcceptanceThreshold") },
        { json: "riskDetails", js: "riskDetails", typ: r("AcceptanceThreshold") },
    ], false),
    "IDUnion": o([
        { json: "anyOf", js: "anyOf", typ: a(r("IDUnionAnyOf")) },
        { json: "title", js: "title", typ: "" },
    ], false),
    "IDUnionAnyOf": o([
        { json: "$ref", js: "$ref", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, r("Type")) },
        { json: "format", js: "format", typ: u(undefined, "") },
    ], false),
    "InputDataConfig": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("InputDataConfigProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "InputDataConfigProperties": o([
        { json: "s3Uri", js: "s3Uri", typ: r("AcceptanceThreshold") },
    ], false),
    "OutputDataConfig": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("OutputDataConfigProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "OutputDataConfigProperties": o([
        { json: "kmsKeyId", js: "kmsKeyId", typ: r("AcceptanceThreshold") },
        { json: "s3Uri", js: "s3Uri", typ: r("AcceptanceThreshold") },
    ], false),
    "RegistrationConfig": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("RegistrationConfigProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "RegistrationConfigProperties": o([
        { json: "duplicateRegistrationAction", js: "duplicateRegistrationAction", typ: r("AcceptanceThreshold") },
        { json: "fraudsterSimilarityThreshold", js: "fraudsterSimilarityThreshold", typ: r("AcceptanceThreshold") },
    ], false),
    "Session": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("SessionProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "SessionProperties": o([
        { json: "authenticationAudioProgress", js: "authenticationAudioProgress", typ: r("Items") },
        { json: "authenticationConfiguration", js: "authenticationConfiguration", typ: r("DataClass") },
        { json: "enrollmentAudioProgress", js: "enrollmentAudioProgress", typ: r("Items") },
        { json: "fraudDetectionAudioProgress", js: "fraudDetectionAudioProgress", typ: r("Items") },
        { json: "fraudDetectionConfiguration", js: "fraudDetectionConfiguration", typ: r("DataClass") },
        { json: "generatedSpeakerId", js: "generatedSpeakerId", typ: r("EnrollmentStatus") },
        { json: "sessionId", js: "sessionId", typ: r("AcceptanceThreshold") },
        { json: "sessionName", js: "sessionName", typ: r("AcceptanceThreshold") },
        { json: "streamingConfiguration", js: "streamingConfiguration", typ: r("Items") },
        { json: "authenticationResult", js: "authenticationResult", typ: r("DataClass") },
        { json: "fraudDetectionResult", js: "fraudDetectionResult", typ: r("DataClass") },
        { json: "streamingStatus", js: "streamingStatus", typ: r("AcceptanceThreshold") },
    ], false),
    "StreamingConfiguration": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("StreamingConfigurationProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "StreamingConfigurationProperties": o([
        { json: "authenticationMinimumSpeechInSeconds", js: "authenticationMinimumSpeechInSeconds", typ: r("AcceptanceThreshold") },
    ], false),
    "SystemAttributes": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("SystemAttributesProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "SystemAttributesProperties": o([
        { json: "aws:connect:OriginalContactArn", js: "aws:connect:OriginalContactArn", typ: r("AcceptanceThreshold") },
    ], false),
    "TionAudioProgress": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("TionAudioProgressProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "TionAudioProgressProperties": o([
        { json: "audioAggregationEndedAt", js: "audioAggregationEndedAt", typ: r("AudioAggregationEndedAt") },
        { json: "audioAggregationStartedAt", js: "audioAggregationStartedAt", typ: r("Time") },
    ], false),
    "Type": [
        "integer",
        "null",
        "string",
    ],
};
