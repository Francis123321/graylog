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
import PropTypes from 'prop-types';
// eslint-disable-next-line no-restricted-imports
import createReactClass from 'create-react-class';
import Reflux from 'reflux';
import styled, { css } from 'styled-components';

import { DocumentTitle, IfPermitted, PageHeader, Spinner } from 'components/common';
import { Alert, Col, Row } from 'components/graylog';
import { GraylogClusterOverview } from 'components/cluster';
import DocumentationLink from 'components/support/DocumentationLink';
import EnterpriseFreeLicenseForm from 'components/enterprise/EnterpriseFreeLicenseForm';
import PluginList from 'components/enterprise/PluginList';
import CombinedProvider from 'injection/CombinedProvider';
import HideOnCloud from 'util/conditional/HideOnCloud';

const { EnterpriseActions, EnterpriseStore } = CombinedProvider.get('Enterprise');

const EnterpriseProductLink = ({ children }) => {
  return (
    <a href="https://www.graylog.org/products/enterprise"
       rel="noopener noreferrer"
       target="_blank">
      {children}
    </a>
  );
};

EnterpriseProductLink.propTypes = {
  children: PropTypes.node,
};

EnterpriseProductLink.defaultProps = {
  children: null,
};

const EnterpriseFeatureList = styled.ul`
  list-style-type: disc;
  padding-left: 20px;
`;

const BiggerFontSize = styled.div(({ theme }) => css`
  font-size: ${theme.fonts.size.large};
`);

const GraylogEnterpriseHeader = styled.h2`
  margin-bottom: 10px;
`;

const EnterprisePage = createReactClass({
  displayName: 'EnterprisePage',
  mixins: [Reflux.connect(EnterpriseStore)],

  componentDidMount() {
    EnterpriseActions.getLicenseInfo();
  },

  onFreeLicenseFormSubmit(formFields, callback) {
    EnterpriseActions.requestFreeEnterpriseLicense(formFields)
      .then(() => callback(true))
      .catch(() => callback(false));
  },

  _isLoading() {
    const { licenseStatus } = this.state;

    return !licenseStatus;
  },

  renderLicenseFormContent(licenseStatus) {
    let licenseFormContent;

    if (this._isLoading()) {
      licenseFormContent = <Spinner text="Loading license status" />;
    } else if (licenseStatus === 'installed') {
      licenseFormContent = (
        <Alert bsStyle="success">
          You have a Graylog Enterprise license installed.
        </Alert>
      );
    } else if (licenseStatus === 'staged') {
      licenseFormContent = (
        <Alert bsStyle="warning">
          You requested a free Graylog Enterprise license. It will be activated once you restart the Graylog
          server with the Graylog Enterprise plugins installed.
        </Alert>
      );
    } else {
      licenseFormContent = <EnterpriseFreeLicenseForm onSubmit={this.onFreeLicenseFormSubmit} />;
    }

    return licenseFormContent;
  },

  render() {
    const { licenseStatus } = this.state;

    return (
      <DocumentTitle title="Try Graylog Enterprise">
        <div>
          <PageHeader title="?????? Graylog Enterprise">
            {null}

            <span>
              Graylog Enterprise ????????? Graylog ?????????????????????????????? ????????????<EnterpriseProductLink>???????????? </EnterpriseProductLink>??????????????? Graylog Enterprise ??????????????????
            </span>
          </PageHeader>

          <GraylogClusterOverview layout="compact">
            <PluginList />
          </GraylogClusterOverview>
          <HideOnCloud>
            <IfPermitted permissions="freelicenses:create">
              <Row className="content">
                <Col md={6}>
                  <GraylogEnterpriseHeader>Graylog ?????? </GraylogEnterpriseHeader>
                  <BiggerFontSize>
                    <p><strong>?????? 30 ?????? Graylog Enterprise ?????????????????? Graylog ?????????????????? </strong></p>
                    <p>
                      Graylog Enterprise ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                    </p>

                    <p>Graylog ???????????? :</p>

                    <EnterpriseFeatureList>
                      <li>??????<DocumentationLink page="archiving.html" text={<strong>??????</strong>} />?????????</li>
                      <li>Graylog ???????????????<DocumentationLink page="auditlog.html" text={<strong>????????????</strong>} /></li>
                      <li>
                        ??????<DocumentationLink page="alerts.html#filter-with-dynamic-lists-enterprise-feature" text={<strong>????????????</strong>} />?????????<DocumentationLink page="alerts.html" text={<strong>????????????</strong>} />???????????????????????????????????????????????????????????????????????????
                      </li>
                      <li>
                        ????????????????????????????????????<DocumentationLink page="reporting.html" text={<strong>????????????</strong>} />???????????? Graylog ??????????????????
                      </li>
                      <li>
                        <DocumentationLink page="searching/parameters.html" text={<strong>?????????????????????</strong>} />?????????????????????????????????
                      </li>
                      <li>
                        <DocumentationLink page="integrations/forwarder.html" text={<strong>???????????????</strong>} />??????????????????????????? Graylog ???????????????
                      </li>
                      <li>??????...</li>
                    </EnterpriseFeatureList>
                  </BiggerFontSize>
                </Col>
                <Col md={6}>
                  {this.renderLicenseFormContent(licenseStatus)}
                </Col>
              </Row>
            </IfPermitted>
          </HideOnCloud>
        </div>
      </DocumentTitle>
    );
  },
});

export default EnterprisePage;
