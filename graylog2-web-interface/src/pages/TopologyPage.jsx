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
import createReactClass from 'create-react-class';
import withLocation from 'routing/withLocation';
import { SearchActions } from 'views/stores/SearchStore';

const TopologyPage = createReactClass({
  componentDidMount() {
    console.log('组件初始化了')
    // window.addNewVue().$mount('#topologyAppsContainer')
    // vue里通过这个this调用getData方法
    window.setReactThis(this)

  },
  getData: function (data) {
    console.log("查询条件："+data)
    window.setReactData('这是查询返回值')
    // SearchActions.get('612498751e94a10ddf821acf').then(function (data) {
    //   console.log(data)
    // })
    SearchActions.parameters(['612498751e94a10ddf821acf']).then(function (data) {
      console.log(data)
    })
  },
  render() {
    return (
      <DocumentTitle title="Topology">
        {/*yangzy_tabContent*/}
        <Row className="content" style={{height: '100%'}}>
          <Col md={12} style={{height: '100%'}}>
            <div id="topologyAppsContainer" style={{width:'100%',height:'100%'}}>渲染中，请稍等...</div>
          </Col>
        </Row>
      </DocumentTitle>
    );
  }
})

TopologyPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default withLocation(TopologyPage);
