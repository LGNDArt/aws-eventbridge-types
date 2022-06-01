// To parse this data:
//
//   import { Convert, AwsGuardduty } from "./file";
//
//   const awsGuardduty = Convert.toAwsGuardduty(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsGuardduty {
    $schema:     string;
    type:        string;
    items:       NetworkConnectionActionClass;
    definitions: Definitions;
}

export interface Definitions {
    AwsGuarddutyElement:     AwsGuarddutyElement;
    Detail:                  Detail;
    Resource:                Resource;
    InstanceDetails:         InstanceDetails;
    NetworkInterface:        NetworkInterface;
    PrivateIPAddress:        PrivateIPAddress;
    SecurityGroup:           SecurityGroup;
    Tag:                     Tag;
    Service:                 Service;
    Action:                  Action;
    NetworkConnectionAction: NetworkConnectionAction;
    PortDetails:             PortDetails;
    RemoteIPDetails:         RemoteIPDetails;
    City:                    City;
    Country:                 Country;
    GeoLocation:             GeoLocation;
    Organization:            Organization;
    AdditionalInfo:          AdditionalInfo;
}

export interface Action {
    type:                 string;
    additionalProperties: boolean;
    properties:           ActionProperties;
    required:             string[];
    title:                string;
}

export interface ActionProperties {
    actionType:              ActionType;
    networkConnectionAction: NetworkConnectionActionClass;
}

export interface ActionType {
    type: Type;
}

export enum Type {
    Boolean = "boolean",
    Integer = "integer",
    String = "string",
}

export interface NetworkConnectionActionClass {
    $ref: string;
}

export interface AdditionalInfo {
    type:                 string;
    additionalProperties: boolean;
    properties:           AdditionalInfoProperties;
    required:             string[];
    title:                string;
}

export interface AdditionalInfoProperties {
    unusualProtocol: ActionType;
    threatListName:  ActionType;
    unusual:         ActionType;
}

export interface AwsGuarddutyElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsGuarddutyElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsGuarddutyElementProperties {
    version:       ID;
    id:            ID;
    "detail-type": ActionType;
    source:        ActionType;
    account:       ActionType;
    time:          ID;
    region:        ActionType;
    resources:     Resources;
    detail:        NetworkConnectionActionClass;
}

export interface ID {
    type:   Type;
    format: string;
}

export interface Resources {
    type:  string;
    items: ResourcesItems;
}

export interface ResourcesItems {
}

export interface City {
    type:                 string;
    additionalProperties: boolean;
    properties:           CityProperties;
    required:             string[];
    title:                string;
}

export interface CityProperties {
    cityName: ActionType;
}

export interface Country {
    type:                 string;
    additionalProperties: boolean;
    properties:           CountryProperties;
    required:             string[];
    title:                string;
}

export interface CountryProperties {
    countryName: ActionType;
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             string[];
    title:                string;
}

export interface DetailProperties {
    schemaVersion: ActionType;
    accountId:     ActionType;
    region:        ActionType;
    partition:     ActionType;
    id:            ActionType;
    arn:           ActionType;
    type:          ActionType;
    resource:      NetworkConnectionActionClass;
    service:       NetworkConnectionActionClass;
    severity:      ActionType;
    createdAt:     ID;
    updatedAt:     ID;
    title:         ActionType;
    description:   ActionType;
}

export interface GeoLocation {
    type:                 string;
    additionalProperties: boolean;
    properties:           GeoLocationProperties;
    required:             string[];
    title:                string;
}

export interface GeoLocationProperties {
    lat: ActionType;
    lon: ActionType;
}

export interface InstanceDetails {
    type:                 string;
    additionalProperties: boolean;
    properties:           InstanceDetailsProperties;
    required:             string[];
    title:                string;
}

export interface InstanceDetailsProperties {
    instanceId:        ActionType;
    instanceType:      ActionType;
    launchTime:        ActionType;
    productCodes:      Resources;
    networkInterfaces: NetworkInterfaces;
    tags:              NetworkInterfaces;
    instanceState:     ActionType;
    availabilityZone:  ActionType;
    imageId:           ActionType;
    imageDescription:  ActionType;
}

export interface NetworkInterfaces {
    type:  string;
    items: NetworkConnectionActionClass;
}

export interface NetworkConnectionAction {
    type:                 string;
    additionalProperties: boolean;
    properties:           NetworkConnectionActionProperties;
    required:             string[];
    title:                string;
}

export interface NetworkConnectionActionProperties {
    connectionDirection: ActionType;
    remoteIpDetails:     NetworkConnectionActionClass;
    remotePortDetails:   NetworkConnectionActionClass;
    localPortDetails:    NetworkConnectionActionClass;
    protocol:            ActionType;
    blocked:             ActionType;
}

export interface NetworkInterface {
    type:                 string;
    additionalProperties: boolean;
    properties:           NetworkInterfaceProperties;
    required:             string[];
    title:                string;
}

export interface NetworkInterfaceProperties {
    ipv6Addresses:      Resources;
    privateDnsName:     ActionType;
    privateIpAddress:   ActionType;
    privateIpAddresses: NetworkInterfaces;
    subnetId:           ActionType;
    vpcId:              ActionType;
    securityGroups:     NetworkInterfaces;
    publicDnsName:      ActionType;
    publicIp:           ActionType;
}

export interface Organization {
    type:                 string;
    additionalProperties: boolean;
    properties:           OrganizationProperties;
    required:             string[];
    title:                string;
}

export interface OrganizationProperties {
    asn: ActionType;
    isp: ActionType;
    org: ActionType;
}

export interface PortDetails {
    type:                 string;
    additionalProperties: boolean;
    properties:           PortDetailsProperties;
    required:             string[];
    title:                string;
}

export interface PortDetailsProperties {
    port:     ActionType;
    portName: ActionType;
}

export interface PrivateIPAddress {
    type:                 string;
    additionalProperties: boolean;
    properties:           PrivateIPAddressProperties;
    required:             string[];
    title:                string;
}

export interface PrivateIPAddressProperties {
    privateDnsName:   ActionType;
    privateIpAddress: ActionType;
}

export interface RemoteIPDetails {
    type:                 string;
    additionalProperties: boolean;
    properties:           RemoteIPDetailsProperties;
    required:             string[];
    title:                string;
}

export interface RemoteIPDetailsProperties {
    ipAddressV4:  ActionType;
    organization: NetworkConnectionActionClass;
    country:      NetworkConnectionActionClass;
    city:         NetworkConnectionActionClass;
    geoLocation:  NetworkConnectionActionClass;
}

export interface Resource {
    type:                 string;
    additionalProperties: boolean;
    properties:           ResourceProperties;
    required:             string[];
    title:                string;
}

export interface ResourceProperties {
    resourceType:    ActionType;
    instanceDetails: NetworkConnectionActionClass;
}

export interface SecurityGroup {
    type:                 string;
    additionalProperties: boolean;
    properties:           SecurityGroupProperties;
    required:             string[];
    title:                string;
}

export interface SecurityGroupProperties {
    groupName: ActionType;
    groupId:   ActionType;
}

export interface Service {
    type:                 string;
    additionalProperties: boolean;
    properties:           ServiceProperties;
    required:             string[];
    title:                string;
}

export interface ServiceProperties {
    serviceName:    ActionType;
    detectorId:     ActionType;
    action:         NetworkConnectionActionClass;
    resourceRole:   ActionType;
    additionalInfo: NetworkConnectionActionClass;
    eventFirstSeen: ID;
    eventLastSeen:  ID;
    archived:       ActionType;
    count:          ActionType;
}

export interface Tag {
    type:                 string;
    additionalProperties: boolean;
    properties:           TagProperties;
    required:             string[];
    title:                string;
}

export interface TagProperties {
    key:   ActionType;
    value: ActionType;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsGuardduty(json: string): AwsGuardduty {
        return cast(JSON.parse(json), r("AwsGuardduty"));
    }

    public static awsGuarddutyToJson(value: AwsGuardduty): string {
        return JSON.stringify(uncast(value, r("AwsGuardduty")), null, 2);
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
    "AwsGuardduty": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("NetworkConnectionActionClass") },
        { json: "definitions", js: "definitions", typ: r("Definitions") },
    ], false),
    "Definitions": o([
        { json: "AwsGuarddutyElement", js: "AwsGuarddutyElement", typ: r("AwsGuarddutyElement") },
        { json: "Detail", js: "Detail", typ: r("Detail") },
        { json: "Resource", js: "Resource", typ: r("Resource") },
        { json: "InstanceDetails", js: "InstanceDetails", typ: r("InstanceDetails") },
        { json: "NetworkInterface", js: "NetworkInterface", typ: r("NetworkInterface") },
        { json: "PrivateIPAddress", js: "PrivateIPAddress", typ: r("PrivateIPAddress") },
        { json: "SecurityGroup", js: "SecurityGroup", typ: r("SecurityGroup") },
        { json: "Tag", js: "Tag", typ: r("Tag") },
        { json: "Service", js: "Service", typ: r("Service") },
        { json: "Action", js: "Action", typ: r("Action") },
        { json: "NetworkConnectionAction", js: "NetworkConnectionAction", typ: r("NetworkConnectionAction") },
        { json: "PortDetails", js: "PortDetails", typ: r("PortDetails") },
        { json: "RemoteIPDetails", js: "RemoteIPDetails", typ: r("RemoteIPDetails") },
        { json: "City", js: "City", typ: r("City") },
        { json: "Country", js: "Country", typ: r("Country") },
        { json: "GeoLocation", js: "GeoLocation", typ: r("GeoLocation") },
        { json: "Organization", js: "Organization", typ: r("Organization") },
        { json: "AdditionalInfo", js: "AdditionalInfo", typ: r("AdditionalInfo") },
    ], false),
    "Action": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ActionProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ActionProperties": o([
        { json: "actionType", js: "actionType", typ: r("ActionType") },
        { json: "networkConnectionAction", js: "networkConnectionAction", typ: r("NetworkConnectionActionClass") },
    ], false),
    "ActionType": o([
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "NetworkConnectionActionClass": o([
        { json: "$ref", js: "$ref", typ: "" },
    ], false),
    "AdditionalInfo": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AdditionalInfoProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AdditionalInfoProperties": o([
        { json: "unusualProtocol", js: "unusualProtocol", typ: r("ActionType") },
        { json: "threatListName", js: "threatListName", typ: r("ActionType") },
        { json: "unusual", js: "unusual", typ: r("ActionType") },
    ], false),
    "AwsGuarddutyElement": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("AwsGuarddutyElementProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "AwsGuarddutyElementProperties": o([
        { json: "version", js: "version", typ: r("ID") },
        { json: "id", js: "id", typ: r("ID") },
        { json: "detail-type", js: "detail-type", typ: r("ActionType") },
        { json: "source", js: "source", typ: r("ActionType") },
        { json: "account", js: "account", typ: r("ActionType") },
        { json: "time", js: "time", typ: r("ID") },
        { json: "region", js: "region", typ: r("ActionType") },
        { json: "resources", js: "resources", typ: r("Resources") },
        { json: "detail", js: "detail", typ: r("NetworkConnectionActionClass") },
    ], false),
    "ID": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "format", js: "format", typ: "" },
    ], false),
    "Resources": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("ResourcesItems") },
    ], false),
    "ResourcesItems": o([
    ], false),
    "City": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("CityProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "CityProperties": o([
        { json: "cityName", js: "cityName", typ: r("ActionType") },
    ], false),
    "Country": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("CountryProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "CountryProperties": o([
        { json: "countryName", js: "countryName", typ: r("ActionType") },
    ], false),
    "Detail": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("DetailProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DetailProperties": o([
        { json: "schemaVersion", js: "schemaVersion", typ: r("ActionType") },
        { json: "accountId", js: "accountId", typ: r("ActionType") },
        { json: "region", js: "region", typ: r("ActionType") },
        { json: "partition", js: "partition", typ: r("ActionType") },
        { json: "id", js: "id", typ: r("ActionType") },
        { json: "arn", js: "arn", typ: r("ActionType") },
        { json: "type", js: "type", typ: r("ActionType") },
        { json: "resource", js: "resource", typ: r("NetworkConnectionActionClass") },
        { json: "service", js: "service", typ: r("NetworkConnectionActionClass") },
        { json: "severity", js: "severity", typ: r("ActionType") },
        { json: "createdAt", js: "createdAt", typ: r("ID") },
        { json: "updatedAt", js: "updatedAt", typ: r("ID") },
        { json: "title", js: "title", typ: r("ActionType") },
        { json: "description", js: "description", typ: r("ActionType") },
    ], false),
    "GeoLocation": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("GeoLocationProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "GeoLocationProperties": o([
        { json: "lat", js: "lat", typ: r("ActionType") },
        { json: "lon", js: "lon", typ: r("ActionType") },
    ], false),
    "InstanceDetails": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("InstanceDetailsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "InstanceDetailsProperties": o([
        { json: "instanceId", js: "instanceId", typ: r("ActionType") },
        { json: "instanceType", js: "instanceType", typ: r("ActionType") },
        { json: "launchTime", js: "launchTime", typ: r("ActionType") },
        { json: "productCodes", js: "productCodes", typ: r("Resources") },
        { json: "networkInterfaces", js: "networkInterfaces", typ: r("NetworkInterfaces") },
        { json: "tags", js: "tags", typ: r("NetworkInterfaces") },
        { json: "instanceState", js: "instanceState", typ: r("ActionType") },
        { json: "availabilityZone", js: "availabilityZone", typ: r("ActionType") },
        { json: "imageId", js: "imageId", typ: r("ActionType") },
        { json: "imageDescription", js: "imageDescription", typ: r("ActionType") },
    ], false),
    "NetworkInterfaces": o([
        { json: "type", js: "type", typ: "" },
        { json: "items", js: "items", typ: r("NetworkConnectionActionClass") },
    ], false),
    "NetworkConnectionAction": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("NetworkConnectionActionProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "NetworkConnectionActionProperties": o([
        { json: "connectionDirection", js: "connectionDirection", typ: r("ActionType") },
        { json: "remoteIpDetails", js: "remoteIpDetails", typ: r("NetworkConnectionActionClass") },
        { json: "remotePortDetails", js: "remotePortDetails", typ: r("NetworkConnectionActionClass") },
        { json: "localPortDetails", js: "localPortDetails", typ: r("NetworkConnectionActionClass") },
        { json: "protocol", js: "protocol", typ: r("ActionType") },
        { json: "blocked", js: "blocked", typ: r("ActionType") },
    ], false),
    "NetworkInterface": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("NetworkInterfaceProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "NetworkInterfaceProperties": o([
        { json: "ipv6Addresses", js: "ipv6Addresses", typ: r("Resources") },
        { json: "privateDnsName", js: "privateDnsName", typ: r("ActionType") },
        { json: "privateIpAddress", js: "privateIpAddress", typ: r("ActionType") },
        { json: "privateIpAddresses", js: "privateIpAddresses", typ: r("NetworkInterfaces") },
        { json: "subnetId", js: "subnetId", typ: r("ActionType") },
        { json: "vpcId", js: "vpcId", typ: r("ActionType") },
        { json: "securityGroups", js: "securityGroups", typ: r("NetworkInterfaces") },
        { json: "publicDnsName", js: "publicDnsName", typ: r("ActionType") },
        { json: "publicIp", js: "publicIp", typ: r("ActionType") },
    ], false),
    "Organization": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("OrganizationProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "OrganizationProperties": o([
        { json: "asn", js: "asn", typ: r("ActionType") },
        { json: "isp", js: "isp", typ: r("ActionType") },
        { json: "org", js: "org", typ: r("ActionType") },
    ], false),
    "PortDetails": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("PortDetailsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "PortDetailsProperties": o([
        { json: "port", js: "port", typ: r("ActionType") },
        { json: "portName", js: "portName", typ: r("ActionType") },
    ], false),
    "PrivateIPAddress": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("PrivateIPAddressProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "PrivateIPAddressProperties": o([
        { json: "privateDnsName", js: "privateDnsName", typ: r("ActionType") },
        { json: "privateIpAddress", js: "privateIpAddress", typ: r("ActionType") },
    ], false),
    "RemoteIPDetails": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("RemoteIPDetailsProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "RemoteIPDetailsProperties": o([
        { json: "ipAddressV4", js: "ipAddressV4", typ: r("ActionType") },
        { json: "organization", js: "organization", typ: r("NetworkConnectionActionClass") },
        { json: "country", js: "country", typ: r("NetworkConnectionActionClass") },
        { json: "city", js: "city", typ: r("NetworkConnectionActionClass") },
        { json: "geoLocation", js: "geoLocation", typ: r("NetworkConnectionActionClass") },
    ], false),
    "Resource": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ResourceProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ResourceProperties": o([
        { json: "resourceType", js: "resourceType", typ: r("ActionType") },
        { json: "instanceDetails", js: "instanceDetails", typ: r("NetworkConnectionActionClass") },
    ], false),
    "SecurityGroup": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("SecurityGroupProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "SecurityGroupProperties": o([
        { json: "groupName", js: "groupName", typ: r("ActionType") },
        { json: "groupId", js: "groupId", typ: r("ActionType") },
    ], false),
    "Service": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("ServiceProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "ServiceProperties": o([
        { json: "serviceName", js: "serviceName", typ: r("ActionType") },
        { json: "detectorId", js: "detectorId", typ: r("ActionType") },
        { json: "action", js: "action", typ: r("NetworkConnectionActionClass") },
        { json: "resourceRole", js: "resourceRole", typ: r("ActionType") },
        { json: "additionalInfo", js: "additionalInfo", typ: r("NetworkConnectionActionClass") },
        { json: "eventFirstSeen", js: "eventFirstSeen", typ: r("ID") },
        { json: "eventLastSeen", js: "eventLastSeen", typ: r("ID") },
        { json: "archived", js: "archived", typ: r("ActionType") },
        { json: "count", js: "count", typ: r("ActionType") },
    ], false),
    "Tag": o([
        { json: "type", js: "type", typ: "" },
        { json: "additionalProperties", js: "additionalProperties", typ: true },
        { json: "properties", js: "properties", typ: r("TagProperties") },
        { json: "required", js: "required", typ: a("") },
        { json: "title", js: "title", typ: "" },
    ], false),
    "TagProperties": o([
        { json: "key", js: "key", typ: r("ActionType") },
        { json: "value", js: "value", typ: r("ActionType") },
    ], false),
    "Type": [
        "boolean",
        "integer",
        "string",
    ],
};
