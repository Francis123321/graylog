/*
 * Copyright (C) 2020 Graylog, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the Server Side Public License, version 1,
 * as published by MongoDB, Inc.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * Server Side Public License for more details.
 *
 * You should have received a copy of the Server Side Public License
 * along with this program. If not, see
 * <http://www.mongodb.com/licensing/server-side-public-license>.
 */
import React from 'react';
import styled, { css } from 'styled-components';

const StyledPre = styled.pre(({ theme }) => css`
  font-size: ${theme.fonts.size.small};
`);

const DnsAdapterDocumentation = () => {
  const styleMarginBottom = { marginBottom: 10 };

  const aResponse = `{
  "single_value": "34.239.63.98",
  "multi_value": {
    "results": [
      {
        "ip_address": "34.239.63.98",
        "dns_ttl": 60
      },
      {
        "ip_address": "34.238.48.57",
        "dns_ttl": 60
      }
    ]
  },
  "ttl": 60000
}`;

  const aaaaResponse = `{
  "single_value": "2307:f8b0:3000:800:0:0:0:200e",
  "multi_value": {
    "results": [
      {
        "ip_address": "2307:f8b0:3000:800:0:0:0:200e",
        "dns_ttl": 77
      }
    ]
  },
  "ttl": 77000
}`;

  const aAndAaaaResponse = `{
  "single_value": "144.222.6.132",
  "multi_value": {
    "results": [
      {
        "ip_address": "144.222.6.132",
        "dns_ttl": 32,
        "ip_version": "IPv4"
      },
      {
        "ip_address": "1207:f8b1:6003:b01:0:0:0:8a",
        "dns_ttl": 299,
        "ip_version": "IPv6"
      }
    ]
  },
  "ttl": 32000
}`;

  const ptrResponse = `{
  "single_value": "c-45-216-65-41.hd1.fl.someisp.co.uk",
  "multi_value": {
    "domain": "someisp.co.uk",
    "full_domain": "c-45-216-65-41.hd1.fl.someisp.co.uk",
    "dns_ttl": "300",
  },
  "ttl": 300000
}`;

  const txtResponse = `{
  "single_value": null,
  "multi_value": {
    "results": [
      {
        "value": "Some text value that lives in a TXT DNS",
        "dns_ttl": 300
      },
      {
        "value": "v=spf1 include:some-email-domain.org ~all.",
        "dns_ttl": 200
      }
    ]
  },
  "ttl": 200000
}`;

  return (

    <div>

      <h3 style={styleMarginBottom}>配置</h3>

      <h5 style={styleMarginBottom}>DNS 查询类型</h5>

      <p style={styleMarginBottom}>
        <strong>将主机名解析为 IPv4 地址 (A)</strong>：返回包含主机名解析为的 IPv4 地址之一的<code>single_value</code>和包含主机名解析为的所有 IPv4 地址的<code>multi_value</code>。
        此类型的输入必须是纯域名（例如<code>api.graylog.com</code>）。
      </p>
      <StyledPre>{aResponse}</StyledPre>

      <p style={styleMarginBottom}>
        <strong>将主机名解析为 IPv6 地址 (AAAA) </strong>：返回包含主机名解析为的 IPv6 地址之一的<code>single_value</code>和包含主机名解析为的所有 IPv6 地址的<code>multi_value</code>。
        此类型的输入必须是纯域名（例如<code>api.graylog.com</code>）。
      </p>
      <StyledPre>{aaaaResponse}</StyledPre>

      <p style={styleMarginBottom}>
        <strong>将主机名解析为 IPv4 和 IPv6 地址（A 和 AAAA）：</strong>：返回包含主机名解析为的 IPv4 或 IPv6 地址之一的<code>single_value</code>（如果可用，将返回 IPv4），以及包含主机名的所有 IPv4 和 IPv6 地址的<code>multi_value</code>决心。 此类型的输入必须是纯域名（例如 <code>api.graylog.com</code>）。
      </p>
      <StyledPre>{aAndAaaaResponse}</StyledPre>

      <p style={styleMarginBottom}>
        <strong>反向查找 (PTR)</strong>：如果为 IP 地址定义，则返回包含 PTR 值的<code>single_value</code>。 <code>域</code>字段显示域名（没有子域）。 <code>full_domain</code>字段显示完整的未修剪主机名/PTR 值。 此类型的输入必须是纯 IPv4 或 IPv6 地址（例如 <code>10.0.0.1</code> 或 <code>2622:f3b0:4000:812::200c</code>）。
      </p>
      <StyledPre>{ptrResponse}</StyledPre>

      <p style={styleMarginBottom}>
        <strong>文本查找 (TXT)</strong>：返回一个 <code>multi_value</code>，其中包含为主机名定义的所有 TXT 记录。 此类型的输入必须是纯域名（例如 <code>api.graylog.com</code>）。
      </p>
      <StyledPre>{txtResponse}</StyledPre>

      <h5 style={styleMarginBottom}>DNS 服务器 IP 地址</h5>

      <p style={styleMarginBottom}>
        要使用的 DNS 服务器 IP 地址和可选端口的逗号分隔列表（例如 <code>192.168.1.1:5353, 192.168.1.244</code>）。 将此留空以使用为本地系统定义的 DNS 服务器。 除非另有说明，否则所有请求都使用端口 53。
      </p>

      <h5 style={styleMarginBottom}>DNS 请求超时</h5>

      <p style={styleMarginBottom}>
        DNS 请求超时（以毫秒为单位）。
      </p>

      <h5 style={styleMarginBottom}>缓存 TTL 覆盖</h5>

      <p style={styleMarginBottom}>
        如果启用，此适配器缓存的 TTL 将被指定的值覆盖。
      </p>

    </div>
  );
};

export default DnsAdapterDocumentation;
