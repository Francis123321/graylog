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
/* eslint-disable react/no-unescaped-entities, no-template-curly-in-string */
import React from 'react';

import { Alert, Col, Row } from 'components/graylog';

const HTTPJSONPathAdapterDocumentation = () => {
  const exampleJSON = `{
  "user": {
    "login": "jane",
    "full_name": "Jane Doe",
    "roles": ["admin", "developer"],
    "contact": {
      "email": "jane@example.com",
      "cellphone": "+49123456789"
    }
  }
}`;
  const noMultiResult = '{"value": "Jane Doe"}';
  const mapResult = `{
  "login": "jane",
  "full_name": "Jane Doe",
  "roles": ["admin", "developer"],
  "contact": {
    "email": "jane@example.com",
    "cellphone": "+49123456789"
  }
}`;
  const smallMapResult = `{
  "email": "jane@example.com",
  "cellphone": "+49123456789"
}`;
  const listResult = `{
  "value": ["admin", "developer"]
}`;
  const pipelineRule = `rule "lookup user"
when has_field("user_login")
then
  // Get the user login from the message
  let userLogin = to_string($message.user_login);
  // Lookup the single value, in our case the full name, in the user-api lookup table
  let userName = lookup_value("user-api", userLogin);
  // Set the field "user_name" in the message
  set_field("user_name", userName)

  // Lookup the multi value in the user-api lookup table
  let userData = lookup("user-api", userLogin);
  // Set the email and cellphone as fields in the message
  set_field("user_email", userData["email"]);
  set_field("user_cellphone", userData["cellphone"]);
end`;

  return (
    <div>
      <p>
        HTTPJSONPath 数据适配器执行 <em>HTTP GET</em> 请求以查找键并根据配置的 JSONPath 表达式解析结果。
      </p>

      <Alert style={{ marginBottom: 10 }} bsStyle="info">
        每个查找表结果都有两个值。 <em>单值</em>和<em>多值</em>。 当查找结果预期为字符串、数字或布尔值时，将使用单个值。 当查找结果预期为地图或列表时，将使用 multi 值。
      </Alert>

      <h3 style={{ marginBottom: 10 }}>配置</h3>

      <h5 style={{ marginBottom: 10 }}>查找网址</h5>
      <p style={{ marginBottom: 10, padding: 0 }}>
        将用于 HTTP 请求的 URL。 要在 URL 中使用 <em>查找键</em>，可以使用 <code>{'${key}'}</code> 值。 该变量将被传递给查找函数的实际键替换。 <br />
        （示例：<code>{'https://example.com/api/lookup?key=${key}'}</code>）
      </p>

      <h5 style={{ marginBottom: 10 }}>单值 JSONPath </h5>
      <p style={{ marginBottom: 10, padding: 0 }}>
        此 JSONPath 表达式将用于解析查找结果的<em>单个值</em>。
        （例如：<code>$.user.full_name</code>）
      </p>

      <h5 style={{ marginBottom: 10 }}>多值 JSONPath</h5>
      <p style={{ marginBottom: 10, padding: 0 }}>
        此 JSONPath 表达式将用于解析查找结果的 <em>multi value</em>。 （例如：<code>$.users[*]</code>）
        多值 JSONPath 设置是<em>可选</em>。 没有它，单值也会出现在多值结果中。
      </p>

      <h5 style={{ marginBottom: 10 }}>HTTP 用户代理</h5>
      <p style={{ marginBottom: 10, padding: 0 }}>
        这是将用于 HTTP 请求的 <em>User-Agent</em> 标头。 您应该提供一些联系方式，以便您查询的服务所有者知道在出现问题时与谁联系。
        （比如来自 Graylog 集群的过多 API 请求）
      </p>

      <hr />

      <h3 style={{ marginBottom: 10 }}>例子</h3>
      <p>
        这显示了一个示例配置以及将从查找中返回的值。<br />
        配置的 URL 是 <strong>{'https://example.com/api/users/${key}'}</strong> 并且 <code>{'${key}'}</code> 被替换 在查找请求期间由 <strong>jane</strong> 提供。
      </p>
      <p>
        这是生成的 JSON 文档：
      </p>
      <pre>{exampleJSON}</pre>

      <Row>
        <Col md={4}>
          <h5 style={{ marginBottom: 10 }}>配置</h5>
          <p style={{ marginBottom: 10, padding: 0 }}>
            单值 JSONPath: <code>$.user.full_name</code><br />
            多值 JSONPath: <em>empty</em><br />
          </p>
        </Col>
        <Col md={8}>
          <h5 style={{ marginBottom: 10 }}>Result</h5>
          <p style={{ marginBottom: 10, padding: 0 }}>
            单值: <code>Jane Doe</code><br />
            多值:
            <pre>{noMultiResult}</pre>
          </p>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <h5 style={{ marginBottom: 10 }}>配置</h5>
          <p style={{ marginBottom: 10, padding: 0 }}>
            单值 JSONPath: <code>$.user.full_name</code><br />
            多值 JSONPath: <code>$.user</code><br />
          </p>
        </Col>
        <Col md={8}>
          <h5 style={{ marginBottom: 10 }}>结果</h5>
          <p style={{ marginBottom: 10, padding: 0 }}>
            单值: <code>Jane Doe</code><br />
            多值:
            <pre>{mapResult}</pre>
          </p>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <h5 style={{ marginBottom: 10 }}>配置</h5>
          <p style={{ marginBottom: 10, padding: 0 }}>
            单值 JSONPath: <code>$.user.contact.email</code><br />
            多值 JSONPath: <code>$.user.roles[*]</code><br />
          </p>
        </Col>
        <Col md={8}>
          <h5 style={{ marginBottom: 10 }}>结果</h5>
          <p style={{ marginBottom: 10, padding: 0 }}>
            单值: <code>jane@example.com</code><br />
            多值:
            <pre>{listResult}</pre>
          </p>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <h5 style={{ marginBottom: 10 }}>配置</h5>
          <p style={{ marginBottom: 10, padding: 0 }}>
            单值 JSONPath: <code>$.user.full_name</code><br />
            多值 JSONPath: <code>$.user.contact</code><br />
          </p>
        </Col>
        <Col md={8}>
          <h5 style={{ marginBottom: 10 }}>结果</h5>
          <p style={{ marginBottom: 10, padding: 0 }}>
            单值: <code>Jane Doe</code><br />
            多值:
            <pre>{smallMapResult}</pre>
          </p>
        </Col>
      </Row>

      <h5 style={{ marginBottom: 10 }}>管道规则</h5>
      <p>
        这是一个示例管道规则，它使用我们上一个配置示例中的示例数据。
      </p>
      <pre>{pipelineRule}</pre>
    </div>
  );
};

export default HTTPJSONPathAdapterDocumentation;
