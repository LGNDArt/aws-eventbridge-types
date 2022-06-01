// To parse this data:
//
//   import { Convert, AwsSagemaker } from "./file";
//
//   const awsSagemaker = Convert.toAwsSagemaker(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsSagemaker {
    $schema:     string;
    type:        string;
    items:       DetailClass;
    definitions: Definitions;
}

export interface Definitions {
    AwsSagemakerElement:                         AwsSagemakerElement;
    Detail:                                      Detail;
    DetailAlgorithmSpecification:                DetailAlgorithmSpecification;
    AppSpecification:                            AppSpecification;
    Environment:                                 Environment;
    ExperimentConfig:                            ExperimentConfig;
    FeatureDefinition:                           FeatureDefinition;
    HyperParameters:                             HyperParameters;
    InputDataConfig:                             InputDataConfig;
    InputDataConfigDataSource:                   DataSource;
    PurpleS3DataSource:                          PurpleS3DataSource;
    NetworkConfig:                               NetworkConfig;
    VpcConfig:                                   VpcConfig;
    ObjectiveStatusCounters:                     ObjectiveStatusCounters;
    OfflineStoreConfig:                          OfflineStoreConfig;
    DataCatalogConfig:                           DataCatalogConfig;
    S3StorageConfig:                             S3StorageConfig;
    OnlineStoreConfig:                           OnlineStoreConfig;
    OutputDataConfig:                            OutputDataConfig;
    ProcessingInput:                             ProcessingInput;
    S3Input:                                     S3Input;
    ProcessingOutputConfig:                      ProcessingOutputConfig;
    Output:                                      Output;
    S3Output:                                    S3Output;
    ProcessingResources:                         ProcessingResources;
    Config:                                      Config;
    StoppingCondition:                           StoppingCondition;
    TrainingJobDefinition:                       TrainingJobDefinition;
    TrainingJobDefinitionAlgorithmSpecification: TrainingJobDefinitionAlgorithmSpecification;
    MetricDefinition:                            MetricDefinition;
    TrainingJobStatusCounters:                   TrainingJobStatusCounters;
    TransformInput:                              TransformInput;
    TransformInputDataSource:                    DataSource;
    FluffyS3DataSource:                          FluffyS3DataSource;
    TransformOutput:                             TransformOutput;
    TransformResources:                          TransformResources;
    Metadata:                                    Metadata;
    ProcessingJob:                               ProcessingJob;
    Time:                                        TimeClass;
    Region:                                      Region;
    Source:                                      Region;
}

export interface AppSpecification {
    type:                 string;
    additionalProperties: boolean;
    properties:           AppSpecificationProperties;
    required:             string[];
    title:                string;
}

export interface AppSpecificationProperties {
    ImageUri: ImageURI;
}

export interface ImageURI {
    type: Type;
}

export enum Type {
    Boolean = "boolean",
    Integer = "integer",
    String = "string",
}

export interface AwsSagemakerElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsSagemakerElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsSagemakerElementProperties {
    version:       Time;
    id:            ImageURI;
    "detail-type": ImageURI;
    source:        DetailClass;
    account:       ImageURI;
    time:          Time;
    region:        DetailClass;
    resources:     Resources;
    detail:        DetailClass;
}

export interface DetailClass {
    $ref: string;
}

export interface Resources {
    type:  string;
    items: ImageURI;
}

export interface Time {
    type:    Type;
    format?: Format;
}

export enum Format {
    DateTime = "date-time",
    Integer = "integer",
    UUID = "uuid",
}

export interface Config {
    type:                 string;
    additionalProperties: boolean;
    properties:           ConfigProperties;
    required:             string[];
    title:                string;
}

export interface ConfigProperties {
    InstanceCount:  ImageURI;
    InstanceType:   ImageURI;
    VolumeSizeInGB: ImageURI;
    VolumeKmsKeyId: ImageURI;
}

export interface DataCatalogConfig {
    type:                 string;
    additionalProperties: boolean;
    properties:           DataCatalogConfigProperties;
    required:             string[];
    title:                string;
}

export interface DataCatalogConfigProperties {
    TableName: ImageURI;
    Catalog:   ImageURI;
    Database:  ImageURI;
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             any[];
    title:                string;
}

export interface DetailProperties {
    TrainingJobName:                 Time;
    TrainingJobArn:                  ImageURI;
    TrainingJobStatus:               ImageURI;
    SecondaryStatus:                 ImageURI;
    FailureReason:                   ImageURI;
    HyperParameters:                 DetailClass;
    AlgorithmSpecification:          DetailClass;
    RoleArn:                         ImageURI;
    InputDataConfig:                 FeatureDefinitions;
    OutputDataConfig:                DetailClass;
    ResourceConfig:                  DetailClass;
    VpcConfig:                       DetailClass;
    StoppingCondition:               DetailClass;
    CreationTime:                    DetailClass;
    TrainingStartTime:               Time;
    TrainingEndTime:                 Time;
    LastModifiedTime:                DetailClass;
    SecondaryStatusTransitions:      SecondaryStatusTransitions;
    Tags:                            DetailClass;
    TransformJobName:                Time;
    TransformJobArn:                 ImageURI;
    TransformJobStatus:              ImageURI;
    ModelName:                       ImageURI;
    MaxConcurrentTransforms:         ImageURI;
    MaxPayloadInMB:                  ImageURI;
    BatchStrategy:                   ImageURI;
    Environment:                     DetailClass;
    TransformInput:                  DetailClass;
    TransformOutput:                 DetailClass;
    TransformResources:              DetailClass;
    TransformStartTime:              Time;
    TransformEndTime:                Time;
    HyperParameterTuningJobName:     Time;
    HyperParameterTuningJobArn:      ImageURI;
    TrainingJobDefinition:           DetailClass;
    HyperParameterTuningJobStatus:   ImageURI;
    TrainingJobStatusCounters:       DetailClass;
    ObjectiveStatusCounters:         DetailClass;
    trainingJobName:                 ImageURI;
    severity:                        ImageURI;
    state:                           ImageURI;
    message:                         ImageURI;
    LabelingJobStatus:               ImageURI;
    FeatureGroupArn:                 ImageURI;
    FeatureGroupName:                ImageURI;
    RecordIdentifierFeatureName:     ImageURI;
    EventTimeFeatureName:            ImageURI;
    FeatureDefinitions:              FeatureDefinitions;
    OnlineStoreConfig:               DetailClass;
    OfflineStoreConfig:              DetailClass;
    FeatureGroupStatus:              ImageURI;
    ProcessingInputs:                FeatureDefinitions;
    ProcessingOutputConfig:          DetailClass;
    ProcessingJobName:               ImageURI;
    ProcessingResources:             DetailClass;
    AppSpecification:                DetailClass;
    NetworkConfig:                   DetailClass;
    ExperimentConfig:                DetailClass;
    ProcessingJobArn:                ImageURI;
    ProcessingJobStatus:             ImageURI;
    ImageName:                       Time;
    ImageArn:                        ImageURI;
    ImageStatus:                     ImageURI;
    Version:                         ImageURI;
    ImageVersionArn:                 ImageURI;
    ImageVersionStatus:              ImageURI;
    pipelineExecutionDisplayName:    ImageURI;
    currentPipelineExecutionStatus:  ImageURI;
    previousPipelineExecutionStatus: ImageURI;
    executionStartTime:              Time;
    executionEndTime:                Time;
    pipelineExecutionDescription:    ImageURI;
    pipelineArn:                     ImageURI;
    pipelineExecutionArn:            ImageURI;
    metadata:                        DetailClass;
    stepStartTime:                   Time;
    stepEndTime:                     Time;
    stepName:                        ImageURI;
    stepType:                        ImageURI;
    previousStepStatus:              ImageURI;
    currentStepStatus:               ImageURI;
}

export interface FeatureDefinitions {
    type:  string;
    items: DetailClass;
}

export interface SecondaryStatusTransitions {
    type:  string;
    items: SecondaryStatusTransitionsItems;
}

export interface SecondaryStatusTransitionsItems {
}

export interface DetailAlgorithmSpecification {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailAlgorithmSpecificationProperties;
    required:             string[];
    title:                string;
}

export interface DetailAlgorithmSpecificationProperties {
    TrainingImage:     ImageURI;
    TrainingInputMode: ImageURI;
}

export interface Environment {
    type:                 string;
    additionalProperties: boolean;
    properties:           EnvironmentProperties;
    required:             string[];
    title:                string;
}

export interface EnvironmentProperties {
    environment1: ImageURI;
}

export interface ExperimentConfig {
    type:                 string;
    additionalProperties: boolean;
    title:                string;
}

export interface FeatureDefinition {
    type:                 string;
    additionalProperties: boolean;
    properties:           FeatureDefinitionProperties;
    required:             string[];
    title:                string;
}

export interface FeatureDefinitionProperties {
    FeatureName: ImageURI;
    FeatureType: ImageURI;
}

export interface FluffyS3DataSource {
    type:                 string;
    additionalProperties: boolean;
    properties:           FluffyS3DataSourceProperties;
    required:             string[];
    title:                string;
}

export interface FluffyS3DataSourceProperties {
    S3DataType: ImageURI;
    S3Uri:      ImageURI;
}

export interface HyperParameters {
    type:                 string;
    additionalProperties: boolean;
    properties:           HyperParametersProperties;
    required:             string[];
    title:                string;
}

export interface HyperParametersProperties {
    Hyper: ImageURI;
}

export interface InputDataConfig {
    type:                 string;
    additionalProperties: boolean;
    properties:           InputDataConfigProperties;
    required:             string[];
    title:                string;
}

export interface InputDataConfigProperties {
    ChannelName:       ImageURI;
    DataSource:        DetailClass;
    ContentType:       ImageURI;
    CompressionType:   ImageURI;
    RecordWrapperType: ImageURI;
}

export interface DataSource {
    type:                 string;
    additionalProperties: boolean;
    properties:           InputDataConfigDataSourceProperties;
    required:             string[];
    title:                string;
}

export interface InputDataConfigDataSourceProperties {
    S3DataSource: DetailClass;
}

export interface Metadata {
    type:                 string;
    additionalProperties: boolean;
    properties:           MetadataProperties;
    required:             string[];
    title:                string;
}

export interface MetadataProperties {
    processingJob: DetailClass;
}

export interface MetricDefinition {
    type:                 string;
    additionalProperties: boolean;
    properties:           MetricDefinitionProperties;
    required:             string[];
    title:                string;
}

export interface MetricDefinitionProperties {
    Name:  ImageURI;
    Regex: ImageURI;
}

export interface NetworkConfig {
    type:                 string;
    additionalProperties: boolean;
    properties:           NetworkConfigProperties;
    required:             string[];
    title:                string;
}

export interface NetworkConfigProperties {
    EnableInterContainerTrafficEncryption: ImageURI;
    EnableNetworkIsolation:                ImageURI;
    VpcConfig:                             DetailClass;
}

export interface ObjectiveStatusCounters {
    type:                 string;
    additionalProperties: boolean;
    properties:           ObjectiveStatusCountersProperties;
    required:             string[];
    title:                string;
}

export interface ObjectiveStatusCountersProperties {
    Succeeded: ImageURI;
    Pending:   ImageURI;
    Failed:    ImageURI;
}

export interface OfflineStoreConfig {
    type:                 string;
    additionalProperties: boolean;
    properties:           OfflineStoreConfigProperties;
    required:             string[];
    title:                string;
}

export interface OfflineStoreConfigProperties {
    S3StorageConfig:          DetailClass;
    DisableGlueTableCreation: ImageURI;
    DataCatalogConfig:        DetailClass;
}

export interface OnlineStoreConfig {
    type:                 string;
    additionalProperties: boolean;
    properties:           OnlineStoreConfigProperties;
    required:             string[];
    title:                string;
}

export interface OnlineStoreConfigProperties {
    EnableOnlineStore: ImageURI;
}

export interface Output {
    type:                 string;
    additionalProperties: boolean;
    properties:           OutputProperties;
    required:             string[];
    title:                string;
}

export interface OutputProperties {
    OutputName: ImageURI;
    S3Output:   DetailClass;
}

export interface OutputDataConfig {
    type:                 string;
    additionalProperties: boolean;
    properties:           OutputDataConfigProperties;
    required:             string[];
    title:                string;
}

export interface OutputDataConfigProperties {
    KmsKeyId:     ImageURI;
    S3OutputPath: ImageURI;
}

export interface ProcessingInput {
    type:                 string;
    additionalProperties: boolean;
    properties:           ProcessingInputProperties;
    required:             string[];
    title:                string;
}

export interface ProcessingInputProperties {
    InputName: ImageURI;
    S3Input:   DetailClass;
}

export interface ProcessingJob {
    type:                 string;
    additionalProperties: boolean;
    properties:           ProcessingJobProperties;
    required:             string[];
    title:                string;
}

export interface ProcessingJobProperties {
    arn: ImageURI;
}

export interface ProcessingOutputConfig {
    type:                 string;
    additionalProperties: boolean;
    properties:           ProcessingOutputConfigProperties;
    required:             string[];
    title:                string;
}

export interface ProcessingOutputConfigProperties {
    Outputs:  FeatureDefinitions;
    KmsKeyId: ImageURI;
}

export interface ProcessingResources {
    type:                 string;
    additionalProperties: boolean;
    properties:           ProcessingResourcesProperties;
    required:             string[];
    title:                string;
}

export interface ProcessingResourcesProperties {
    ClusterConfig: DetailClass;
}

export interface PurpleS3DataSource {
    type:                 string;
    additionalProperties: boolean;
    properties:           PurpleS3DataSourceProperties;
    required:             string[];
    title:                string;
}

export interface PurpleS3DataSourceProperties {
    S3DataType:             ImageURI;
    S3Uri:                  ImageURI;
    S3DataDistributionType: ImageURI;
}

export interface Region {
    type:  Type;
    enum:  string[];
    title: string;
}

export interface S3Input {
    type:                 string;
    additionalProperties: boolean;
    properties:           S3InputProperties;
    required:             string[];
    title:                string;
}

export interface S3InputProperties {
    S3Uri:                  ImageURI;
    LocalPath:              ImageURI;
    S3DataType:             ImageURI;
    S3InputMode:            ImageURI;
    S3DataDistributionType: ImageURI;
}

export interface S3Output {
    type:                 string;
    additionalProperties: boolean;
    properties:           S3OutputProperties;
    required:             string[];
    title:                string;
}

export interface S3OutputProperties {
    S3Uri:        ImageURI;
    LocalPath:    ImageURI;
    S3UploadMode: ImageURI;
}

export interface S3StorageConfig {
    type:                 string;
    additionalProperties: boolean;
    properties:           S3StorageConfigProperties;
    required:             string[];
    title:                string;
}

export interface S3StorageConfigProperties {
    S3Uri: ImageURI;
}

export interface StoppingCondition {
    type:                 string;
    additionalProperties: boolean;
    properties:           StoppingConditionProperties;
    required:             string[];
    title:                string;
}

export interface StoppingConditionProperties {
    MaxRuntimeInSeconds: ImageURI;
}

export interface TimeClass {
    anyOf: Time[];
    title: string;
}

export interface TrainingJobDefinition {
    type:                 string;
    additionalProperties: boolean;
    properties:           TrainingJobDefinitionProperties;
    required:             string[];
    title:                string;
}

export interface TrainingJobDefinitionProperties {
    StaticHyperParameters:  DetailClass;
    AlgorithmSpecification: DetailClass;
    RoleArn:                ImageURI;
    InputDataConfig:        FeatureDefinitions;
    VpcConfig:              DetailClass;
    OutputDataConfig:       DetailClass;
    ResourceConfig:         DetailClass;
    StoppingCondition:      DetailClass;
}

export interface TrainingJobDefinitionAlgorithmSpecification {
    type:                 string;
    additionalProperties: boolean;
    properties:           TrainingJobDefinitionAlgorithmSpecificationProperties;
    required:             string[];
    title:                string;
}

export interface TrainingJobDefinitionAlgorithmSpecificationProperties {
    TrainingImage:     ImageURI;
    TrainingInputMode: ImageURI;
    MetricDefinitions: FeatureDefinitions;
}

export interface TrainingJobStatusCounters {
    type:                 string;
    additionalProperties: boolean;
    properties:           TrainingJobStatusCountersProperties;
    required:             string[];
    title:                string;
}

export interface TrainingJobStatusCountersProperties {
    Completed:         ImageURI;
    InProgress:        ImageURI;
    RetryableError:    ImageURI;
    NonRetryableError: ImageURI;
    Stopped:           ImageURI;
}

export interface TransformInput {
    type:                 string;
    additionalProperties: boolean;
    properties:           TransformInputProperties;
    required:             string[];
    title:                string;
}

export interface TransformInputProperties {
    DataSource:      DetailClass;
    ContentType:     ImageURI;
    CompressionType: ImageURI;
    SplitType:       ImageURI;
}

export interface TransformOutput {
    type:                 string;
    additionalProperties: boolean;
    properties:           TransformOutputProperties;
    required:             string[];
    title:                string;
}

export interface TransformOutputProperties {
    S3OutputPath: ImageURI;
    Accept:       ImageURI;
    AssembleWith: ImageURI;
    KmsKeyId:     ImageURI;
}

export interface TransformResources {
    type:                 string;
    additionalProperties: boolean;
    properties:           TransformResourcesProperties;
    required:             string[];
    title:                string;
}

export interface TransformResourcesProperties {
    InstanceType:  ImageURI;
    InstanceCount: ImageURI;
}

export interface VpcConfig {
    type:                 string;
    additionalProperties: boolean;
    properties:           VpcConfigProperties;
    required:             string[];
    title:                string;
}

export interface VpcConfigProperties {
    SecurityGroupIds: Resources;
    Subnets:          Resources;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsSagemaker(json: string): AwsSagemaker {
        return cast(JSON.parse(json), r("AwsSagemaker"));
    }

    public static awsSagemakerToJson(value: AwsSagemaker): string {
        return JSON.stringify(uncast(value, r("AwsSagemaker")), null, 2);
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
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsSagemakerElement", js: "AwsSagemakerElement", typ: r("AwsSagemakerElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "DetailAlgorithmSpecification", js: "DetailAlgorithmSpecification", typ: r("DetailAlgorithmSpecification") },
        { json: "AppSpecification", js: "AppSpecification", typ: r("AppSpecification") },
        { json: "Environment", js: "Environment", typ: r("Environment") },
        { json: "ExperimentConfig", js: "ExperimentConfig", typ: r("ExperimentConfig") },
        { json: "FeatureDefinition", js: "FeatureDefinition", typ: r("FeatureDefinition") },
        { json: "HyperParameters", js: "HyperParameters", typ: r("HyperParameters") },
        { json: "InputDataConfig", js: "InputDataConfig", typ: r("InputDataConfig") },
        { json: "InputDataConfigDataSource", js: "InputDataConfigDataSource", typ: r("DataSource") },
        { json: "PurpleS3DataSource", js: "PurpleS3DataSource", typ: r("PurpleS3DataSource") },
        { json: "NetworkConfig", js: "NetworkConfig", typ: r("NetworkConfig") },
        { json: "VpcConfig", js: "VpcConfig", typ: r("VpcConfig") },
        { json: "ObjectiveStatusCounters", js: "ObjectiveStatusCounters", typ: r("ObjectiveStatusCounters") },
        { json: "OfflineStoreConfig", js: "OfflineStoreConfig", typ: r("OfflineStoreConfig") },
        { json: "DataCatalogConfig", js: "DataCatalogConfig", typ: r("DataCatalogConfig") },
        { json: "S3StorageConfig", js: "S3StorageConfig", typ: r("S3StorageConfig") },
        { json: "OnlineStoreConfig", js: "OnlineStoreConfig", typ: r("OnlineStoreConfig") },
        { json: "OutputDataConfig", js: "OutputDataConfig", typ: r("OutputDataConfig") },
        { json: "ProcessingInput", js: "ProcessingInput", typ: r("ProcessingInput") },
        { json: "S3Input", js: "S3Input", typ: r("S3Input") },
        { json: "ProcessingOutputConfig", js: "ProcessingOutputConfig", typ: r("ProcessingOutputConfig") },
        { json: "Output", js: "Output", typ: r("Output") },
        { json: "S3Output", js: "S3Output", typ: r("S3Output") },
        { json: "ProcessingResources", js: "ProcessingResources", typ: r("ProcessingResources") },
        { json: "Config", js: "Config", typ: r("Config") },
        { json: "StoppingCondition", js: "StoppingCondition", typ: r("StoppingCondition") },
        { json: "TrainingJobDefinition", js: "TrainingJobDefinition", typ: r("TrainingJobDefinition") },
        { json: "TrainingJobDefinitionAlgorithmSpecification", js: "TrainingJobDefinitionAlgorithmSpecification", typ: r("TrainingJobDefinitionAlgorithmSpecification") },
        { json: "MetricDefinition", js: "MetricDefinition", typ: r("MetricDefinition") },
        { json: "TrainingJobStatusCounters", js: "TrainingJobStatusCounters", typ: r("TrainingJobStatusCounters") },
        { json: "TransformInput", js: "TransformInput", typ: r("TransformInput") },
        { json: "TransformInputDataSource", js: "TransformInputDataSource", typ: r("DataSource") },
        { json: "FluffyS3DataSource", js: "FluffyS3DataSource", typ: r("FluffyS3DataSource") },
        { json: "TransformOutput", js: "TransformOutput", typ: r("TransformOutput") },
        { json: "TransformResources", js: "TransformResources", typ: r("TransformResources") },
        { json: "Metadata", js: "Metadata", typ: r("Metadata") },
        { json: "ProcessingJob", js: "ProcessingJob", typ: r("ProcessingJob") },
        { json: "Time", js: "Time", typ: r("TimeClass") },
        { json: "Region", js: "Region", typ: r("Region") },
        { json: "Source", js: "Source", typ: r("Region") },
    ], false),
    "AppSpecification": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AppSpecificationProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AppSpecificationProperties": o([
        { json: "ImageUri", js: "ImageUri", typ: r("ImageURI") },
    ], false),
    "ImageURI": o([
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "AwsSagemakerElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsSagemakerElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsSagemakerElementProperties": o([
        { json: "version", js: "version", typ: r("Time") },
        { json: "id", js: "id", typ: r("ImageURI") },
        { json: "detail-type", js: "detail-type", typ: r("ImageURI") },
        { json: "source", js: "source", typ: r("DetailClass") },
        { json: "account", js: "account", typ: r("ImageURI") },
        { json: "time", js: "time", typ: r("Time") },
        { json: "region", js: "region", typ: r("DetailClass") },
        { json: "resources", js: "resources", typ: r("Resources") },
        { json: "detail", js: "detail", typ: r("DetailClass") },
    ], false),
    "DetailClass": o([
        { json: "$ref", js: "$ref", typ: "" },
    ], false),
    "Resources": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("ImageURI") },
    ], false),
    "Time": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: u(undefined, r("Format")) },
    ], false),
    "Config": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ConfigProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ConfigProperties": o([
        { json: "InstanceCount", js: "InstanceCount", typ: r("ImageURI") },
        { json: "InstanceType", js: "InstanceType", typ: r("ImageURI") },
        { json: "VolumeSizeInGB", js: "VolumeSizeInGB", typ: r("ImageURI") },
        { json: "VolumeKmsKeyId", js: "VolumeKmsKeyId", typ: r("ImageURI") },
    ], false),
    "DataCatalogConfig": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DataCatalogConfigProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DataCatalogConfigProperties": o([
        { json: "TableName", js: "TableName", typ: r("ImageURI") },
        { json: "Catalog", js: "Catalog", typ: r("ImageURI") },
        { json: "Database", js: "Database", typ: r("ImageURI") },
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("any") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "TrainingJobName", js: "TrainingJobName", typ: r("Time") },
        { json: "TrainingJobArn", js: "TrainingJobArn", typ: r("ImageURI") },
        { json: "TrainingJobStatus", js: "TrainingJobStatus", typ: r("ImageURI") },
        { json: "SecondaryStatus", js: "SecondaryStatus", typ: r("ImageURI") },
        { json: "FailureReason", js: "FailureReason", typ: r("ImageURI") },
        { json: "HyperParameters", js: "HyperParameters", typ: r("DetailClass") },
        { json: "AlgorithmSpecification", js: "AlgorithmSpecification", typ: r("DetailClass") },
        { json: "RoleArn", js: "RoleArn", typ: r("ImageURI") },
        { json: "InputDataConfig", js: "InputDataConfig", typ: r("FeatureDefinitions") },
        { json: "OutputDataConfig", js: "OutputDataConfig", typ: r("DetailClass") },
        { json: "ResourceConfig", js: "ResourceConfig", typ: r("DetailClass") },
        { json: "VpcConfig", js: "VpcConfig", typ: r("DetailClass") },
        { json: "StoppingCondition", js: "StoppingCondition", typ: r("DetailClass") },
        { json: "CreationTime", js: "CreationTime", typ: r("DetailClass") },
        { json: "TrainingStartTime", js: "TrainingStartTime", typ: r("Time") },
        { json: "TrainingEndTime", js: "TrainingEndTime", typ: r("Time") },
        { json: "LastModifiedTime", js: "LastModifiedTime", typ: r("DetailClass") },
        { json: "SecondaryStatusTransitions", js: "SecondaryStatusTransitions", typ: r("SecondaryStatusTransitions") },
        { json: "Tags", js: "Tags", typ: r("DetailClass") },
        { json: "TransformJobName", js: "TransformJobName", typ: r("Time") },
        { json: "TransformJobArn", js: "TransformJobArn", typ: r("ImageURI") },
        { json: "TransformJobStatus", js: "TransformJobStatus", typ: r("ImageURI") },
        { json: "ModelName", js: "ModelName", typ: r("ImageURI") },
        { json: "MaxConcurrentTransforms", js: "MaxConcurrentTransforms", typ: r("ImageURI") },
        { json: "MaxPayloadInMB", js: "MaxPayloadInMB", typ: r("ImageURI") },
        { json: "BatchStrategy", js: "BatchStrategy", typ: r("ImageURI") },
        { json: "Environment", js: "Environment", typ: r("DetailClass") },
        { json: "TransformInput", js: "TransformInput", typ: r("DetailClass") },
        { json: "TransformOutput", js: "TransformOutput", typ: r("DetailClass") },
        { json: "TransformResources", js: "TransformResources", typ: r("DetailClass") },
        { json: "TransformStartTime", js: "TransformStartTime", typ: r("Time") },
        { json: "TransformEndTime", js: "TransformEndTime", typ: r("Time") },
        { json: "HyperParameterTuningJobName", js: "HyperParameterTuningJobName", typ: r("Time") },
        { json: "HyperParameterTuningJobArn", js: "HyperParameterTuningJobArn", typ: r("ImageURI") },
        { json: "TrainingJobDefinition", js: "TrainingJobDefinition", typ: r("DetailClass") },
        { json: "HyperParameterTuningJobStatus", js: "HyperParameterTuningJobStatus", typ: r("ImageURI") },
        { json: "TrainingJobStatusCounters", js: "TrainingJobStatusCounters", typ: r("DetailClass") },
        { json: "ObjectiveStatusCounters", js: "ObjectiveStatusCounters", typ: r("DetailClass") },
        { json: "trainingJobName", js: "trainingJobName", typ: r("ImageURI") },
        { json: "severity", js: "severity", typ: r("ImageURI") },
        { json: "state", js: "state", typ: r("ImageURI") },
        { json: "message", js: "message", typ: r("ImageURI") },
        { json: "LabelingJobStatus", js: "LabelingJobStatus", typ: r("ImageURI") },
        { json: "FeatureGroupArn", js: "FeatureGroupArn", typ: r("ImageURI") },
        { json: "FeatureGroupName", js: "FeatureGroupName", typ: r("ImageURI") },
        { json: "RecordIdentifierFeatureName", js: "RecordIdentifierFeatureName", typ: r("ImageURI") },
        { json: "EventTimeFeatureName", js: "EventTimeFeatureName", typ: r("ImageURI") },
        { json: "FeatureDefinitions", js: "FeatureDefinitions", typ: r("FeatureDefinitions") },
        { json: "OnlineStoreConfig", js: "OnlineStoreConfig", typ: r("DetailClass") },
        { json: "OfflineStoreConfig", js: "OfflineStoreConfig", typ: r("DetailClass") },
        { json: "FeatureGroupStatus", js: "FeatureGroupStatus", typ: r("ImageURI") },
        { json: "ProcessingInputs", js: "ProcessingInputs", typ: r("FeatureDefinitions") },
        { json: "ProcessingOutputConfig", js: "ProcessingOutputConfig", typ: r("DetailClass") },
        { json: "ProcessingJobName", js: "ProcessingJobName", typ: r("ImageURI") },
        { json: "ProcessingResources", js: "ProcessingResources", typ: r("DetailClass") },
        { json: "AppSpecification", js: "AppSpecification", typ: r("DetailClass") },
        { json: "NetworkConfig", js: "NetworkConfig", typ: r("DetailClass") },
        { json: "ExperimentConfig", js: "ExperimentConfig", typ: r("DetailClass") },
        { json: "ProcessingJobArn", js: "ProcessingJobArn", typ: r("ImageURI") },
        { json: "ProcessingJobStatus", js: "ProcessingJobStatus", typ: r("ImageURI") },
        { json: "ImageName", js: "ImageName", typ: r("Time") },
        { json: "ImageArn", js: "ImageArn", typ: r("ImageURI") },
        { json: "ImageStatus", js: "ImageStatus", typ: r("ImageURI") },
        { json: "Version", js: "Version", typ: r("ImageURI") },
        { json: "ImageVersionArn", js: "ImageVersionArn", typ: r("ImageURI") },
        { json: "ImageVersionStatus", js: "ImageVersionStatus", typ: r("ImageURI") },
        { json: "pipelineExecutionDisplayName", js: "pipelineExecutionDisplayName", typ: r("ImageURI") },
        { json: "currentPipelineExecutionStatus", js: "currentPipelineExecutionStatus", typ: r("ImageURI") },
        { json: "previousPipelineExecutionStatus", js: "previousPipelineExecutionStatus", typ: r("ImageURI") },
        { json: "executionStartTime", js: "executionStartTime", typ: r("Time") },
        { json: "executionEndTime", js: "executionEndTime", typ: r("Time") },
        { json: "pipelineExecutionDescription", js: "pipelineExecutionDescription", typ: r("ImageURI") },
        { json: "pipelineArn", js: "pipelineArn", typ: r("ImageURI") },
        { json: "pipelineExecutionArn", js: "pipelineExecutionArn", typ: r("ImageURI") },
        { json: "metadata", js: "metadata", typ: r("DetailClass") },
        { json: "stepStartTime", js: "stepStartTime", typ: r("Time") },
        { json: "stepEndTime", js: "stepEndTime", typ: r("Time") },
        { json: "stepName", js: "stepName", typ: r("ImageURI") },
        { json: "stepType", js: "stepType", typ: r("ImageURI") },
        { json: "previousStepStatus", js: "previousStepStatus", typ: r("ImageURI") },
        { json: "currentStepStatus", js: "currentStepStatus", typ: r("ImageURI") },
    ], false),
    "FeatureDefinitions": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("DetailClass") },
    ], false),
    "SecondaryStatusTransitions": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("SecondaryStatusTransitionsItems") },
    ], false),
    "SecondaryStatusTransitionsItems": o([
    ], false),
    "DetailAlgorithmSpecification": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailAlgorithmSpecificationProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailAlgorithmSpecificationProperties": o([
        { json: "TrainingImage", js: "TrainingImage", typ: r("ImageURI") },
        { json: "TrainingInputMode", js: "TrainingInputMode", typ: r("ImageURI") },
    ], false),
    "Environment": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("EnvironmentProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "EnvironmentProperties": o([
        { json: "environment1", js: "environment1", typ: r("ImageURI") },
    ], false),
    "ExperimentConfig": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "title", js: "title", typ: "" },
    ], false),
    "FeatureDefinition": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("FeatureDefinitionProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "FeatureDefinitionProperties": o([
        { json: "FeatureName", js: "FeatureName", typ: r("ImageURI") },
        { json: "FeatureType", js: "FeatureType", typ: r("ImageURI") },
    ], false),
    "FluffyS3DataSource": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("FluffyS3DataSourceProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "FluffyS3DataSourceProperties": o([
        { json: "S3DataType", js: "S3DataType", typ: r("ImageURI") },
        { json: "S3Uri", js: "S3Uri", typ: r("ImageURI") },
    ], false),
    "HyperParameters": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("HyperParametersProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "HyperParametersProperties": o([
        { json: "Hyper", js: "Hyper", typ: r("ImageURI") },
    ], false),
    "InputDataConfig": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("InputDataConfigProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "InputDataConfigProperties": o([
        { json: "ChannelName", js: "ChannelName", typ: r("ImageURI") },
        { json: "DataSource", js: "DataSource", typ: r("DetailClass") },
        { json: "ContentType", js: "ContentType", typ: r("ImageURI") },
        { json: "CompressionType", js: "CompressionType", typ: r("ImageURI") },
        { json: "RecordWrapperType", js: "RecordWrapperType", typ: r("ImageURI") },
    ], false),
    "DataSource": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("InputDataConfigDataSourceProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "InputDataConfigDataSourceProperties": o([
        { json: "S3DataSource", js: "S3DataSource", typ: r("DetailClass") },
    ], false),
    "Metadata": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("MetadataProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "MetadataProperties": o([
        { json: "processingJob", js: "processingJob", typ: r("DetailClass") },
    ], false),
    "MetricDefinition": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("MetricDefinitionProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "MetricDefinitionProperties": o([
        { json: "Name", js: "Name", typ: r("ImageURI") },
        { json: "Regex", js: "Regex", typ: r("ImageURI") },
    ], false),
    "NetworkConfig": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("NetworkConfigProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "NetworkConfigProperties": o([
        { json: "EnableInterContainerTrafficEncryption", js: "EnableInterContainerTrafficEncryption", typ: r("ImageURI") },
        { json: "EnableNetworkIsolation", js: "EnableNetworkIsolation", typ: r("ImageURI") },
        { json: "VpcConfig", js: "VpcConfig", typ: r("DetailClass") },
    ], false),
    "ObjectiveStatusCounters": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ObjectiveStatusCountersProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ObjectiveStatusCountersProperties": o([
        { json: "Succeeded", js: "Succeeded", typ: r("ImageURI") },
        { json: "Pending", js: "Pending", typ: r("ImageURI") },
        { json: "Failed", js: "Failed", typ: r("ImageURI") },
    ], false),
    "OfflineStoreConfig": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("OfflineStoreConfigProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "OfflineStoreConfigProperties": o([
        { json: "S3StorageConfig", js: "S3StorageConfig", typ: r("DetailClass") },
        { json: "DisableGlueTableCreation", js: "DisableGlueTableCreation", typ: r("ImageURI") },
        { json: "DataCatalogConfig", js: "DataCatalogConfig", typ: r("DetailClass") },
    ], false),
    "OnlineStoreConfig": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("OnlineStoreConfigProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "OnlineStoreConfigProperties": o([
        { json: "EnableOnlineStore", js: "EnableOnlineStore", typ: r("ImageURI") },
    ], false),
    "Output": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("OutputProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "OutputProperties": o([
        { json: "OutputName", js: "OutputName", typ: r("ImageURI") },
        { json: "S3Output", js: "S3Output", typ: r("DetailClass") },
    ], false),
    "OutputDataConfig": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("OutputDataConfigProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "OutputDataConfigProperties": o([
        { json: "KmsKeyId", js: "KmsKeyId", typ: r("ImageURI") },
        { json: "S3OutputPath", js: "S3OutputPath", typ: r("ImageURI") },
    ], false),
    "ProcessingInput": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ProcessingInputProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ProcessingInputProperties": o([
        { json: "InputName", js: "InputName", typ: r("ImageURI") },
        { json: "S3Input", js: "S3Input", typ: r("DetailClass") },
    ], false),
    "ProcessingJob": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ProcessingJobProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ProcessingJobProperties": o([
        { json: "arn", js: "arn", typ: r("ImageURI") },
    ], false),
    "ProcessingOutputConfig": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ProcessingOutputConfigProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ProcessingOutputConfigProperties": o([
        { json: "Outputs", js: "Outputs", typ: r("FeatureDefinitions") },
        { json: "KmsKeyId", js: "KmsKeyId", typ: r("ImageURI") },
    ], false),
    "ProcessingResources": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ProcessingResourcesProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ProcessingResourcesProperties": o([
        { json: "ClusterConfig", js: "ClusterConfig", typ: r("DetailClass") },
    ], false),
    "PurpleS3DataSource": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("PurpleS3DataSourceProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "PurpleS3DataSourceProperties": o([
        { json: "S3DataType", js: "S3DataType", typ: r("ImageURI") },
        { json: "S3Uri", js: "S3Uri", typ: r("ImageURI") },
        { json: "S3DataDistributionType", js: "S3DataDistributionType", typ: r("ImageURI") },
    ], false),
    "Region": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "enum", js: "enum", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "S3Input": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("S3InputProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "S3InputProperties": o([
        { json: "S3Uri", js: "S3Uri", typ: r("ImageURI") },
        { json: "LocalPath", js: "LocalPath", typ: r("ImageURI") },
        { json: "S3DataType", js: "S3DataType", typ: r("ImageURI") },
        { json: "S3InputMode", js: "S3InputMode", typ: r("ImageURI") },
        { json: "S3DataDistributionType", js: "S3DataDistributionType", typ: r("ImageURI") },
    ], false),
    "S3Output": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("S3OutputProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "S3OutputProperties": o([
        { json: "S3Uri", js: "S3Uri", typ: r("ImageURI") },
        { json: "LocalPath", js: "LocalPath", typ: r("ImageURI") },
        { json: "S3UploadMode", js: "S3UploadMode", typ: r("ImageURI") },
    ], false),
    "S3StorageConfig": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("S3StorageConfigProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "S3StorageConfigProperties": o([
        { json: "S3Uri", js: "S3Uri", typ: r("ImageURI") },
    ], false),
    "StoppingCondition": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("StoppingConditionProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "StoppingConditionProperties": o([
        { json: "MaxRuntimeInSeconds", js: "MaxRuntimeInSeconds", typ: r("ImageURI") },
    ], false),
    "TimeClass": o([
        { json: "anyOf", js: "anyOf", typ: a(r("Time")) },
        { json: "title", js: "title", typ: "" },
    ], false),
    "TrainingJobDefinition": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("TrainingJobDefinitionProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "TrainingJobDefinitionProperties": o([
        { json: "StaticHyperParameters", js: "StaticHyperParameters", typ: r("DetailClass") },
        { json: "AlgorithmSpecification", js: "AlgorithmSpecification", typ: r("DetailClass") },
        { json: "RoleArn", js: "RoleArn", typ: r("ImageURI") },
        { json: "InputDataConfig", js: "InputDataConfig", typ: r("FeatureDefinitions") },
        { json: "VpcConfig", js: "VpcConfig", typ: r("DetailClass") },
        { json: "OutputDataConfig", js: "OutputDataConfig", typ: r("DetailClass") },
        { json: "ResourceConfig", js: "ResourceConfig", typ: r("DetailClass") },
        { json: "StoppingCondition", js: "StoppingCondition", typ: r("DetailClass") },
    ], false),
    "TrainingJobDefinitionAlgorithmSpecification": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("TrainingJobDefinitionAlgorithmSpecificationProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "TrainingJobDefinitionAlgorithmSpecificationProperties": o([
        { json: "TrainingImage", js: "TrainingImage", typ: r("ImageURI") },
        { json: "TrainingInputMode", js: "TrainingInputMode", typ: r("ImageURI") },
        { json: "MetricDefinitions", js: "MetricDefinitions", typ: r("FeatureDefinitions") },
    ], false),
    "TrainingJobStatusCounters": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("TrainingJobStatusCountersProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "TrainingJobStatusCountersProperties": o([
        { json: "Completed", js: "Completed", typ: r("ImageURI") },
        { json: "InProgress", js: "InProgress", typ: r("ImageURI") },
        { json: "RetryableError", js: "RetryableError", typ: r("ImageURI") },
        { json: "NonRetryableError", js: "NonRetryableError", typ: r("ImageURI") },
        { json: "Stopped", js: "Stopped", typ: r("ImageURI") },
    ], false),
    "TransformInput": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("TransformInputProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "TransformInputProperties": o([
        { json: "DataSource", js: "DataSource", typ: r("DetailClass") },
        { json: "ContentType", js: "ContentType", typ: r("ImageURI") },
        { json: "CompressionType", js: "CompressionType", typ: r("ImageURI") },
        { json: "SplitType", js: "SplitType", typ: r("ImageURI") },
    ], false),
    "TransformOutput": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("TransformOutputProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "TransformOutputProperties": o([
        { json: "S3OutputPath", js: "S3OutputPath", typ: r("ImageURI") },
        { json: "Accept", js: "Accept", typ: r("ImageURI") },
        { json: "AssembleWith", js: "AssembleWith", typ: r("ImageURI") },
        { json: "KmsKeyId", js: "KmsKeyId", typ: r("ImageURI") },
    ], false),
    "TransformResources": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("TransformResourcesProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "TransformResourcesProperties": o([
        { json: "InstanceType", js: "InstanceType", typ: r("ImageURI") },
        { json: "InstanceCount", js: "InstanceCount", typ: r("ImageURI") },
    ], false),
    "VpcConfig": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("VpcConfigProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "VpcConfigProperties": o([
        { json: "SecurityGroupIds", js: "SecurityGroupIds", typ: r("Resources") },
        { json: "Subnets", js: "Subnets", typ: r("Resources") },
    ], false),
    "Type": [
        "boolean",
        "integer",
        "string",
    ],
    "Format": [
        "date-time",
        "integer",
        "uuid",
    ],
};
