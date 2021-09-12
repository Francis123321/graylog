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
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';

import Routes from 'routing/Routes';
import history from 'util/History';
import HTTPHeaderAuthConfig from 'logic/authentication/HTTPHeaderAuthConfig';
import HTTPHeaderAuthConfigDomain from 'domainActions/authentication/HTTPHeaderAuthConfigDomain';
import { Input } from 'components/bootstrap';
import { Button, Col, Row, Alert } from 'components/graylog';
import { FormikFormGroup, ErrorAlert, Spinner, Icon } from 'components/common';
import SectionComponent from 'components/common/Section/SectionComponent';

const HTTPHeaderAuthConfigSection = () => {
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [loadedConfig, setLoadedConfig] = useState<HTTPHeaderAuthConfig | undefined>();
  const sectionTitle = '可信头认证';

  const _onSubmit = (data) => {
    setSubmitError(undefined);

    return HTTPHeaderAuthConfigDomain.update(data).then(() => {
      history.push(Routes.SYSTEM.AUTHENTICATION.AUTHENTICATORS.SHOW);
    }).catch((error) => {
      setSubmitError(error.additional?.res?.text);
    });
  };

  useEffect(() => {
    HTTPHeaderAuthConfigDomain.load().then(setLoadedConfig);
  }, []);

  if (!loadedConfig) {
    return (
      <SectionComponent title={sectionTitle}>
        <Spinner />
      </SectionComponent>
    );
  }

  return (
    <SectionComponent title={sectionTitle}>
      <p>此身份验证器使您能够根据 HTTP 标头登录用户，而无需进一步交互。</p>
      <Formik onSubmit={_onSubmit}
              initialValues={loadedConfig.toJSON()}>
        {({ isSubmitting, isValid }) => (
          <Form className="form form-horizontal">
            <Input id="enable-http-header-auth"
                   labelClassName="col-sm-3"
                   wrapperClassName="col-sm-9"
                   label="启用">
              <FormikFormGroup label="通过 HTTP 标头启用单点登录"
                               name="enabled"
                               formGroupClassName="form-group no-bm"
                               wrapperClassName="col-xs-12"
                               type="checkbox" />
            </Input>
            <FormikFormGroup label="用户名标题"
                             name="username_header"
                             required
                             help="HTTP 标头包含 Graylog 用户的隐式可信名称。 （标题匹配忽略大小写敏感）" />
            <Row>
              <Col mdOffset={3} md={9}>
                <Alert bsStyle="info">
                  <Icon name="info-circle" />请在 Graylog 服务器配置文件中配置<code>trusted_proxies</code>设置。
                </Alert>
              </Col>
            </Row>
            <ErrorAlert runtimeError>{submitError}</ErrorAlert>
            <Row className="no-bm">
              <Col xs={12}>
                <div className="pull-right">
                  <Button bsStyle="success"
                          disabled={isSubmitting || !isValid}
                          title="Update Config"
                          type="submit">
                    更新配置
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </SectionComponent>
  );
};

export default HTTPHeaderAuthConfigSection;
