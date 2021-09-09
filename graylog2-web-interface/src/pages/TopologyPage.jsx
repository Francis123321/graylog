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

import { LinkContainer } from 'components/graylog/router';
import { ButtonToolbar, Col, Row, Button } from 'components/graylog';
import { DocumentTitle, IfPermitted, PageHeader } from 'components/common';
import DocumentationLink from 'components/support/DocumentationLink';
import EventsContainer from 'components/events/events/EventsContainer';
import DocsHelper from 'util/DocsHelper';
import Routes from 'routing/Routes';
import withLocation from 'routing/withLocation';

const TopologyPage = ({ location }) => {
  const filteredSourceStream = location.query.stream_id;

  return (
    <DocumentTitle title="Topology">
      {/*yangzy_tabContent*/}
      {/*<div style={{height:'100%','borderRadius': '4px',*/}
        {/*border: '1px solid #cdcdcd', 'marginBottom': '10px'}}>123</div>*/}

      <Row className="content" style={{height: '100%'}}>
        <Col md={12} style={{height: '100%'}}>
          <iframe width="100%" height='100%' src="topology/index.html" frameBorder="0"></iframe>
        </Col>
      </Row>
    </DocumentTitle>
  );
};

TopologyPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default withLocation(TopologyPage);
