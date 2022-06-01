// To parse this data:
//
//   import { Convert } from "./file";
//
//   const awsSagemaker = Convert.toAwsSagemaker(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsSagemaker {
    version:       string;
    id:            string;
    "detail-type": string;
    source:        Source;
    account:       string;
    time:          Date;
    region:        Region;
    resources:     string[];
    detail:        Detail;
}

export interface Detail {
    TrainingJobName?:                 string;
    TrainingJobArn?:                  string;
    TrainingJobStatus?:               string;
    SecondaryStatus?:                 string;
    FailureReason?:                   string;
    HyperParameters?:                 HyperParameters;
    AlgorithmSpecification?:          DetailAlgorithmSpecification;
    RoleArn?:                         string;
    InputDataConfig?:                 InputDataConfig[];
    OutputDataConfig?:                OutputDataConfig;
    ResourceConfig?:                  Config;
    VpcConfig?:                       ExperimentConfig;
    StoppingCondition?:               StoppingCondition;
    CreationTime?:                    Date | number;
    TrainingStartTime?:               Date;
    TrainingEndTime?:                 Date;
    LastModifiedTime?:                Date | number;
    SecondaryStatusTransitions?:      any[];
    Tags?:                            ExperimentConfig;
    TransformJobName?:                string;
    TransformJobArn?:                 string;
    TransformJobStatus?:              string;
    ModelName?:                       string;
    MaxConcurrentTransforms?:         number;
    MaxPayloadInMB?:                  number;
    BatchStrategy?:                   string;
    Environment?:                     Environment;
    TransformInput?:                  TransformInput;
    TransformOutput?:                 TransformOutput;
    TransformResources?:              TransformResources;
    TransformStartTime?:              Date;
    TransformEndTime?:                Date;
    HyperParameterTuningJobName?:     string;
    HyperParameterTuningJobArn?:      string;
    TrainingJobDefinition?:           TrainingJobDefinition;
    HyperParameterTuningJobStatus?:   string;
    TrainingJobStatusCounters?:       TrainingJobStatusCounters;
    ObjectiveStatusCounters?:         ObjectiveStatusCounters;
    trainingJobName?:                 string;
    severity?:                        string;
    state?:                           string;
    message?:                         string;
    LabelingJobStatus?:               string;
    FeatureGroupArn?:                 string;
    FeatureGroupName?:                string;
    RecordIdentifierFeatureName?:     string;
    EventTimeFeatureName?:            string;
    FeatureDefinitions?:              FeatureDefinition[];
    OnlineStoreConfig?:               OnlineStoreConfig;
    OfflineStoreConfig?:              OfflineStoreConfig;
    FeatureGroupStatus?:              string;
    ProcessingInputs?:                ProcessingInput[];
    ProcessingOutputConfig?:          ProcessingOutputConfig;
    ProcessingJobName?:               string;
    ProcessingResources?:             ProcessingResources;
    AppSpecification?:                AppSpecification;
    NetworkConfig?:                   NetworkConfig;
    ExperimentConfig?:                ExperimentConfig;
    ProcessingJobArn?:                string;
    ProcessingJobStatus?:             string;
    ImageName?:                       string;
    ImageArn?:                        string;
    ImageStatus?:                     string;
    Version?:                         number;
    ImageVersionArn?:                 string;
    ImageVersionStatus?:              string;
    pipelineExecutionDisplayName?:    string;
    currentPipelineExecutionStatus?:  string;
    previousPipelineExecutionStatus?: string;
    executionStartTime?:              Date;
    executionEndTime?:                Date;
    pipelineExecutionDescription?:    string;
    pipelineArn?:                     string;
    pipelineExecutionArn?:            string;
    metadata?:                        Metadata;
    stepStartTime?:                   Date;
    stepEndTime?:                     Date;
    stepName?:                        string;
    stepType?:                        string;
    previousStepStatus?:              string;
    currentStepStatus?:               string;
}

export interface DetailAlgorithmSpecification {
    TrainingImage:     string;
    TrainingInputMode: string;
}

export interface AppSpecification {
    ImageUri: string;
}

export interface Environment {
    environment1: string;
}

export interface ExperimentConfig {
}

export interface FeatureDefinition {
    FeatureName: string;
    FeatureType: string;
}

export interface HyperParameters {
    Hyper: string;
}

export interface InputDataConfig {
    ChannelName:       string;
    DataSource:        InputDataConfigDataSource;
    ContentType:       string;
    CompressionType:   string;
    RecordWrapperType: string;
}

export interface InputDataConfigDataSource {
    S3DataSource: PurpleS3DataSource;
}

export interface PurpleS3DataSource {
    S3DataType:             string;
    S3Uri:                  string;
    S3DataDistributionType: string;
}

export interface NetworkConfig {
    EnableInterContainerTrafficEncryption: boolean;
    EnableNetworkIsolation:                boolean;
    VpcConfig:                             VpcConfig;
}

export interface VpcConfig {
    SecurityGroupIds: string[];
    Subnets:          string[];
}

export interface ObjectiveStatusCounters {
    Succeeded: number;
    Pending:   number;
    Failed:    number;
}

export interface OfflineStoreConfig {
    S3StorageConfig:          S3StorageConfig;
    DisableGlueTableCreation: boolean;
    DataCatalogConfig:        DataCatalogConfig;
}

export interface DataCatalogConfig {
    TableName: string;
    Catalog:   string;
    Database:  string;
}

export interface S3StorageConfig {
    S3Uri: string;
}

export interface OnlineStoreConfig {
    EnableOnlineStore: boolean;
}

export interface OutputDataConfig {
    KmsKeyId:     string;
    S3OutputPath: string;
}

export interface ProcessingInput {
    InputName: string;
    S3Input:   S3Input;
}

export interface S3Input {
    S3Uri:                  string;
    LocalPath:              string;
    S3DataType:             string;
    S3InputMode:            string;
    S3DataDistributionType: string;
}

export interface ProcessingOutputConfig {
    Outputs:  Output[];
    KmsKeyId: string;
}

export interface Output {
    OutputName: string;
    S3Output:   S3Output;
}

export interface S3Output {
    S3Uri:        string;
    LocalPath:    string;
    S3UploadMode: string;
}

export interface ProcessingResources {
    ClusterConfig: Config;
}

export interface Config {
    InstanceCount:  number;
    InstanceType:   string;
    VolumeSizeInGB: number;
    VolumeKmsKeyId: string;
}

export interface StoppingCondition {
    MaxRuntimeInSeconds: number;
}

export interface TrainingJobDefinition {
    StaticHyperParameters:  ExperimentConfig;
    AlgorithmSpecification: TrainingJobDefinitionAlgorithmSpecification;
    RoleArn:                string;
    InputDataConfig:        InputDataConfig[];
    VpcConfig:              VpcConfig;
    OutputDataConfig:       OutputDataConfig;
    ResourceConfig:         Config;
    StoppingCondition:      StoppingCondition;
}

export interface TrainingJobDefinitionAlgorithmSpecification {
    TrainingImage:     string;
    TrainingInputMode: string;
    MetricDefinitions: MetricDefinition[];
}

export interface MetricDefinition {
    Name:  string;
    Regex: string;
}

export interface TrainingJobStatusCounters {
    Completed:         number;
    InProgress:        number;
    RetryableError:    number;
    NonRetryableError: number;
    Stopped:           number;
}

export interface TransformInput {
    DataSource:      TransformInputDataSource;
    ContentType:     string;
    CompressionType: string;
    SplitType:       string;
}

export interface TransformInputDataSource {
    S3DataSource: FluffyS3DataSource;
}

export interface FluffyS3DataSource {
    S3DataType: string;
    S3Uri:      string;
}

export interface TransformOutput {
    S3OutputPath: string;
    Accept:       string;
    AssembleWith: string;
    KmsKeyId:     string;
}

export interface TransformResources {
    InstanceType:  string;
    InstanceCount: number;
}

export interface Metadata {
    processingJob: ProcessingJob;
}

export interface ProcessingJob {
    arn: string;
}

export enum Region {
    UsEast1 = "us-east-1",
    UsWest2 = "us-west-2",
}

export enum Source {
    AwsSagemaker = "aws.sagemaker",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsSagemaker(json: string): AwsSagemaker[] {
        return cast(JSON.parse(json), a(r("AwsSagemaker")));
    }

    public static awsSagemakerToJson(value: AwsSagemaker[]): string {
        return JSON.stringify(uncast(value, a(r("AwsSagemaker"))), null, 2);
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
    "AwsSagemaker": o([
        { json: "version", js: "version", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "detail-type", js: "detail-type", typ: "" },
        { json: "source", js: "source", typ: r("Source") },
        { json: "account", js: "account", typ: "" },
        { json: "time", js: "time", typ: Date },
        { json: "region", js: "region", typ: r("Region") },
        { json: "resources", js: "resources", typ: a("") },
        { json: "detail", js: "detail", typ: r("Detail") },
    ], false),
    "Detail": o([
        { json: "TrainingJobName", js: "TrainingJobName", typ: u(undefined, "") },
        { json: "TrainingJobArn", js: "TrainingJobArn", typ: u(undefined, "") },
        { json: "TrainingJobStatus", js: "TrainingJobStatus", typ: u(undefined, "") },
        { json: "SecondaryStatus", js: "SecondaryStatus", typ: u(undefined, "") },
        { json: "FailureReason", js: "FailureReason", typ: u(undefined, "") },
        { json: "HyperParameters", js: "HyperParameters", typ: u(undefined, r("HyperParameters")) },
        { json: "AlgorithmSpecification", js: "AlgorithmSpecification", typ: u(undefined, r("DetailAlgorithmSpecification")) },
        { json: "RoleArn", js: "RoleArn", typ: u(undefined, "") },
        { json: "InputDataConfig", js: "InputDataConfig", typ: u(undefined, a(r("InputDataConfig"))) },
        { json: "OutputDataConfig", js: "OutputDataConfig", typ: u(undefined, r("OutputDataConfig")) },
        { json: "ResourceConfig", js: "ResourceConfig", typ: u(undefined, r("Config")) },
        { json: "VpcConfig", js: "VpcConfig", typ: u(undefined, r("ExperimentConfig")) },
        { json: "StoppingCondition", js: "StoppingCondition", typ: u(undefined, r("StoppingCondition")) },
        { json: "CreationTime", js: "CreationTime", typ: u(undefined, u(Date, 0)) },
        { json: "TrainingStartTime", js: "TrainingStartTime", typ: u(undefined, Date) },
        { json: "TrainingEndTime", js: "TrainingEndTime", typ: u(undefined, Date) },
        { json: "LastModifiedTime", js: "LastModifiedTime", typ: u(undefined, u(Date, 0)) },
        { json: "SecondaryStatusTransitions", js: "SecondaryStatusTransitions", typ: u(undefined, a("any")) },
        { json: "Tags", js: "Tags", typ: u(undefined, r("ExperimentConfig")) },
        { json: "TransformJobName", js: "TransformJobName", typ: u(undefined, "") },
        { json: "TransformJobArn", js: "TransformJobArn", typ: u(undefined, "") },
        { json: "TransformJobStatus", js: "TransformJobStatus", typ: u(undefined, "") },
        { json: "ModelName", js: "ModelName", typ: u(undefined, "") },
        { json: "MaxConcurrentTransforms", js: "MaxConcurrentTransforms", typ: u(undefined, 0) },
        { json: "MaxPayloadInMB", js: "MaxPayloadInMB", typ: u(undefined, 0) },
        { json: "BatchStrategy", js: "BatchStrategy", typ: u(undefined, "") },
        { json: "Environment", js: "Environment", typ: u(undefined, r("Environment")) },
        { json: "TransformInput", js: "TransformInput", typ: u(undefined, r("TransformInput")) },
        { json: "TransformOutput", js: "TransformOutput", typ: u(undefined, r("TransformOutput")) },
        { json: "TransformResources", js: "TransformResources", typ: u(undefined, r("TransformResources")) },
        { json: "TransformStartTime", js: "TransformStartTime", typ: u(undefined, Date) },
        { json: "TransformEndTime", js: "TransformEndTime", typ: u(undefined, Date) },
        { json: "HyperParameterTuningJobName", js: "HyperParameterTuningJobName", typ: u(undefined, "") },
        { json: "HyperParameterTuningJobArn", js: "HyperParameterTuningJobArn", typ: u(undefined, "") },
        { json: "TrainingJobDefinition", js: "TrainingJobDefinition", typ: u(undefined, r("TrainingJobDefinition")) },
        { json: "HyperParameterTuningJobStatus", js: "HyperParameterTuningJobStatus", typ: u(undefined, "") },
        { json: "TrainingJobStatusCounters", js: "TrainingJobStatusCounters", typ: u(undefined, r("TrainingJobStatusCounters")) },
        { json: "ObjectiveStatusCounters", js: "ObjectiveStatusCounters", typ: u(undefined, r("ObjectiveStatusCounters")) },
        { json: "trainingJobName", js: "trainingJobName", typ: u(undefined, "") },
        { json: "severity", js: "severity", typ: u(undefined, "") },
        { json: "state", js: "state", typ: u(undefined, "") },
        { json: "message", js: "message", typ: u(undefined, "") },
        { json: "LabelingJobStatus", js: "LabelingJobStatus", typ: u(undefined, "") },
        { json: "FeatureGroupArn", js: "FeatureGroupArn", typ: u(undefined, "") },
        { json: "FeatureGroupName", js: "FeatureGroupName", typ: u(undefined, "") },
        { json: "RecordIdentifierFeatureName", js: "RecordIdentifierFeatureName", typ: u(undefined, "") },
        { json: "EventTimeFeatureName", js: "EventTimeFeatureName", typ: u(undefined, "") },
        { json: "FeatureDefinitions", js: "FeatureDefinitions", typ: u(undefined, a(r("FeatureDefinition"))) },
        { json: "OnlineStoreConfig", js: "OnlineStoreConfig", typ: u(undefined, r("OnlineStoreConfig")) },
        { json: "OfflineStoreConfig", js: "OfflineStoreConfig", typ: u(undefined, r("OfflineStoreConfig")) },
        { json: "FeatureGroupStatus", js: "FeatureGroupStatus", typ: u(undefined, "") },
        { json: "ProcessingInputs", js: "ProcessingInputs", typ: u(undefined, a(r("ProcessingInput"))) },
        { json: "ProcessingOutputConfig", js: "ProcessingOutputConfig", typ: u(undefined, r("ProcessingOutputConfig")) },
        { json: "ProcessingJobName", js: "ProcessingJobName", typ: u(undefined, "") },
        { json: "ProcessingResources", js: "ProcessingResources", typ: u(undefined, r("ProcessingResources")) },
        { json: "AppSpecification", js: "AppSpecification", typ: u(undefined, r("AppSpecification")) },
        { json: "NetworkConfig", js: "NetworkConfig", typ: u(undefined, r("NetworkConfig")) },
        { json: "ExperimentConfig", js: "ExperimentConfig", typ: u(undefined, r("ExperimentConfig")) },
        { json: "ProcessingJobArn", js: "ProcessingJobArn", typ: u(undefined, "") },
        { json: "ProcessingJobStatus", js: "ProcessingJobStatus", typ: u(undefined, "") },
        { json: "ImageName", js: "ImageName", typ: u(undefined, "") },
        { json: "ImageArn", js: "ImageArn", typ: u(undefined, "") },
        { json: "ImageStatus", js: "ImageStatus", typ: u(undefined, "") },
        { json: "Version", js: "Version", typ: u(undefined, 0) },
        { json: "ImageVersionArn", js: "ImageVersionArn", typ: u(undefined, "") },
        { json: "ImageVersionStatus", js: "ImageVersionStatus", typ: u(undefined, "") },
        { json: "pipelineExecutionDisplayName", js: "pipelineExecutionDisplayName", typ: u(undefined, "") },
        { json: "currentPipelineExecutionStatus", js: "currentPipelineExecutionStatus", typ: u(undefined, "") },
        { json: "previousPipelineExecutionStatus", js: "previousPipelineExecutionStatus", typ: u(undefined, "") },
        { json: "executionStartTime", js: "executionStartTime", typ: u(undefined, Date) },
        { json: "executionEndTime", js: "executionEndTime", typ: u(undefined, Date) },
        { json: "pipelineExecutionDescription", js: "pipelineExecutionDescription", typ: u(undefined, "") },
        { json: "pipelineArn", js: "pipelineArn", typ: u(undefined, "") },
        { json: "pipelineExecutionArn", js: "pipelineExecutionArn", typ: u(undefined, "") },
        { json: "metadata", js: "metadata", typ: u(undefined, r("Metadata")) },
        { json: "stepStartTime", js: "stepStartTime", typ: u(undefined, Date) },
        { json: "stepEndTime", js: "stepEndTime", typ: u(undefined, Date) },
        { json: "stepName", js: "stepName", typ: u(undefined, "") },
        { json: "stepType", js: "stepType", typ: u(undefined, "") },
        { json: "previousStepStatus", js: "previousStepStatus", typ: u(undefined, "") },
        { json: "currentStepStatus", js: "currentStepStatus", typ: u(undefined, "") },
    ], false),
    "DetailAlgorithmSpecification": o([
        { json: "TrainingImage", js: "TrainingImage", typ: "" },
        { json: "TrainingInputMode", js: "TrainingInputMode", typ: "" },
    ], false),
    "AppSpecification": o([
        { json: "ImageUri", js: "ImageUri", typ: "" },
    ], false),
    "Environment": o([
        { json: "environment1", js: "environment1", typ: "" },
    ], false),
    "ExperimentConfig": o([
    ], false),
    "FeatureDefinition": o([
        { json: "FeatureName", js: "FeatureName", typ: "" },
        { json: "FeatureType", js: "FeatureType", typ: "" },
    ], false),
    "HyperParameters": o([
        { json: "Hyper", js: "Hyper", typ: "" },
    ], false),
    "InputDataConfig": o([
        { json: "ChannelName", js: "ChannelName", typ: "" },
        { json: "DataSource", js: "DataSource", typ: r("InputDataConfigDataSource") },
        { json: "ContentType", js: "ContentType", typ: "" },
        { json: "CompressionType", js: "CompressionType", typ: "" },
        { json: "RecordWrapperType", js: "RecordWrapperType", typ: "" },
    ], false),
    "InputDataConfigDataSource": o([
        { json: "S3DataSource", js: "S3DataSource", typ: r("PurpleS3DataSource") },
    ], false),
    "PurpleS3DataSource": o([
        { json: "S3DataType", js: "S3DataType", typ: "" },
        { json: "S3Uri", js: "S3Uri", typ: "" },
        { json: "S3DataDistributionType", js: "S3DataDistributionType", typ: "" },
    ], false),
    "NetworkConfig": o([
        { json: "EnableInterContainerTrafficEncryption", js: "EnableInterContainerTrafficEncryption", typ: true },
        { json: "EnableNetworkIsolation", js: "EnableNetworkIsolation", typ: true },
        { json: "VpcConfig", js: "VpcConfig", typ: r("VpcConfig") },
    ], false),
    "VpcConfig": o([
        { json: "SecurityGroupIds", js: "SecurityGroupIds", typ: a("") },
        { json: "Subnets", js: "Subnets", typ: a("") },
    ], false),
    "ObjectiveStatusCounters": o([
        { json: "Succeeded", js: "Succeeded", typ: 0 },
        { json: "Pending", js: "Pending", typ: 0 },
        { json: "Failed", js: "Failed", typ: 0 },
    ], false),
    "OfflineStoreConfig": o([
        { json: "S3StorageConfig", js: "S3StorageConfig", typ: r("S3StorageConfig") },
        { json: "DisableGlueTableCreation", js: "DisableGlueTableCreation", typ: true },
        { json: "DataCatalogConfig", js: "DataCatalogConfig", typ: r("DataCatalogConfig") },
    ], false),
    "DataCatalogConfig": o([
        { json: "TableName", js: "TableName", typ: "" },
        { json: "Catalog", js: "Catalog", typ: "" },
        { json: "Database", js: "Database", typ: "" },
    ], false),
    "S3StorageConfig": o([
        { json: "S3Uri", js: "S3Uri", typ: "" },
    ], false),
    "OnlineStoreConfig": o([
        { json: "EnableOnlineStore", js: "EnableOnlineStore", typ: true },
    ], false),
    "OutputDataConfig": o([
        { json: "KmsKeyId", js: "KmsKeyId", typ: "" },
        { json: "S3OutputPath", js: "S3OutputPath", typ: "" },
    ], false),
    "ProcessingInput": o([
        { json: "InputName", js: "InputName", typ: "" },
        { json: "S3Input", js: "S3Input", typ: r("S3Input") },
    ], false),
    "S3Input": o([
        { json: "S3Uri", js: "S3Uri", typ: "" },
        { json: "LocalPath", js: "LocalPath", typ: "" },
        { json: "S3DataType", js: "S3DataType", typ: "" },
        { json: "S3InputMode", js: "S3InputMode", typ: "" },
        { json: "S3DataDistributionType", js: "S3DataDistributionType", typ: "" },
    ], false),
    "ProcessingOutputConfig": o([
        { json: "Outputs", js: "Outputs", typ: a(r("Output")) },
        { json: "KmsKeyId", js: "KmsKeyId", typ: "" },
    ], false),
    "Output": o([
        { json: "OutputName", js: "OutputName", typ: "" },
        { json: "S3Output", js: "S3Output", typ: r("S3Output") },
    ], false),
    "S3Output": o([
        { json: "S3Uri", js: "S3Uri", typ: "" },
        { json: "LocalPath", js: "LocalPath", typ: "" },
        { json: "S3UploadMode", js: "S3UploadMode", typ: "" },
    ], false),
    "ProcessingResources": o([
        { json: "ClusterConfig", js: "ClusterConfig", typ: r("Config") },
    ], false),
    "Config": o([
        { json: "InstanceCount", js: "InstanceCount", typ: 0 },
        { json: "InstanceType", js: "InstanceType", typ: "" },
        { json: "VolumeSizeInGB", js: "VolumeSizeInGB", typ: 0 },
        { json: "VolumeKmsKeyId", js: "VolumeKmsKeyId", typ: "" },
    ], false),
    "StoppingCondition": o([
        { json: "MaxRuntimeInSeconds", js: "MaxRuntimeInSeconds", typ: 0 },
    ], false),
    "TrainingJobDefinition": o([
        { json: "StaticHyperParameters", js: "StaticHyperParameters", typ: r("ExperimentConfig") },
        { json: "AlgorithmSpecification", js: "AlgorithmSpecification", typ: r("TrainingJobDefinitionAlgorithmSpecification") },
        { json: "RoleArn", js: "RoleArn", typ: "" },
        { json: "InputDataConfig", js: "InputDataConfig", typ: a(r("InputDataConfig")) },
        { json: "VpcConfig", js: "VpcConfig", typ: r("VpcConfig") },
        { json: "OutputDataConfig", js: "OutputDataConfig", typ: r("OutputDataConfig") },
        { json: "ResourceConfig", js: "ResourceConfig", typ: r("Config") },
        { json: "StoppingCondition", js: "StoppingCondition", typ: r("StoppingCondition") },
    ], false),
    "TrainingJobDefinitionAlgorithmSpecification": o([
        { json: "TrainingImage", js: "TrainingImage", typ: "" },
        { json: "TrainingInputMode", js: "TrainingInputMode", typ: "" },
        { json: "MetricDefinitions", js: "MetricDefinitions", typ: a(r("MetricDefinition")) },
    ], false),
    "MetricDefinition": o([
        { json: "Name", js: "Name", typ: "" },
        { json: "Regex", js: "Regex", typ: "" },
    ], false),
    "TrainingJobStatusCounters": o([
        { json: "Completed", js: "Completed", typ: 0 },
        { json: "InProgress", js: "InProgress", typ: 0 },
        { json: "RetryableError", js: "RetryableError", typ: 0 },
        { json: "NonRetryableError", js: "NonRetryableError", typ: 0 },
        { json: "Stopped", js: "Stopped", typ: 0 },
    ], false),
    "TransformInput": o([
        { json: "DataSource", js: "DataSource", typ: r("TransformInputDataSource") },
        { json: "ContentType", js: "ContentType", typ: "" },
        { json: "CompressionType", js: "CompressionType", typ: "" },
        { json: "SplitType", js: "SplitType", typ: "" },
    ], false),
    "TransformInputDataSource": o([
        { json: "S3DataSource", js: "S3DataSource", typ: r("FluffyS3DataSource") },
    ], false),
    "FluffyS3DataSource": o([
        { json: "S3DataType", js: "S3DataType", typ: "" },
        { json: "S3Uri", js: "S3Uri", typ: "" },
    ], false),
    "TransformOutput": o([
        { json: "S3OutputPath", js: "S3OutputPath", typ: "" },
        { json: "Accept", js: "Accept", typ: "" },
        { json: "AssembleWith", js: "AssembleWith", typ: "" },
        { json: "KmsKeyId", js: "KmsKeyId", typ: "" },
    ], false),
    "TransformResources": o([
        { json: "InstanceType", js: "InstanceType", typ: "" },
        { json: "InstanceCount", js: "InstanceCount", typ: 0 },
    ], false),
    "Metadata": o([
        { json: "processingJob", js: "processingJob", typ: r("ProcessingJob") },
    ], false),
    "ProcessingJob": o([
        { json: "arn", js: "arn", typ: "" },
    ], false),
    "Region": [
        "us-east-1",
        "us-west-2",
    ],
    "Source": [
        "aws.sagemaker",
    ],
};
