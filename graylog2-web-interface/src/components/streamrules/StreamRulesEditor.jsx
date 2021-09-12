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
import PropTypes from 'prop-types';
import React from 'react';
import styled, { css } from 'styled-components';

import { LinkContainer } from 'components/graylog/router';
import Routes from 'routing/Routes';
import { Button, Col, Panel, Row } from 'components/graylog';
import { Icon } from 'components/common';
import LoaderTabs from 'components/messageloaders/LoaderTabs';
import MatchingTypeSwitcher from 'components/streams/MatchingTypeSwitcher';
import StreamRuleList from 'components/streamrules/StreamRuleList';
import StreamRuleForm from 'components/streamrules/StreamRuleForm';
import Spinner from 'components/common/Spinner';
import StoreProvider from 'injection/StoreProvider';

const StreamsStore = StoreProvider.getStore('Streams');
const StreamRulesStore = StoreProvider.getStore('StreamRules');

const StreamAlertHeader = styled(Panel.Heading)`
  font-weight: bold;
`;

const MatchIcon = styled(({ empty, matches, ...props }) => <Icon {...props} />)(
  ({ empty, matches, theme }) => {
    const matchColor = matches ? theme.colors.variant.success : theme.colors.variant.danger;

    return css`
      color: ${empty ? theme.colors.variant.info : matchColor};
      margin-right: 3px;
    `;
  },
);

const StyledSpinner = styled(Spinner)`
  margin-left: 10px;
`;

class StreamRulesEditor extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    streamId: PropTypes.string.isRequired,
    messageId: PropTypes.string,
    index: PropTypes.string,
  }

  static defaultProps = {
    messageId: '',
    index: '',
  }

  constructor(props) {
    super(props);

    this.state = {
      showStreamRuleForm: false,
    };
  }

  componentDidMount() {
    this.loadData();
    StreamsStore.onChange(this.loadData);
    StreamRulesStore.onChange(this.loadData);
  }

  componentWillUnmount() {
    StreamsStore.unregister(this.loadData);
    StreamRulesStore.unregister(this.loadData);
  }

  onMessageLoaded = (message) => {
    this.setState({ message: message });

    if (message !== undefined) {
      const { streamId } = this.props;

      StreamsStore.testMatch(streamId, { message: message.fields }, (resultData) => {
        this.setState({ matchData: resultData });
      });
    } else {
      this.setState({ matchData: undefined });
    }
  };

  loadData = () => {
    const { streamId } = this.props;
    const { message } = this.state;

    StreamRulesStore.types().then((types) => {
      this.setState({ streamRuleTypes: types });
    });

    StreamsStore.get(streamId, (stream) => {
      this.setState({ stream: stream });
    });

    if (message) {
      this.onMessageLoaded(message);
    }
  };

  _onStreamRuleFormSubmit = (streamRuleId, data) => {
    const { streamId } = this.props;

    StreamRulesStore.create(streamId, data, () => {});
  };

  _onAddStreamRule = (event) => {
    event.preventDefault();
    this.setState({ showStreamRuleForm: true });
  };

  _getListClassName = (matchData) => {
    return (matchData.matches ? 'success' : 'danger');
  };

  _explainMatchResult = () => {
    const { matchData } = this.state;

    if (matchData) {
      if (matchData.matches) {
        return (
          <>
            <MatchIcon matches name="check" /> 此消息将路由到此流！
          </>
        );
      }

      return (
        <>
          <MatchIcon name="times" /> 此消息不会路由到此流。
        </>
      );
    }

    return (
      <>
        <MatchIcon empty name="exclamation-circle" /> 请在上面的步骤 1 中加载一条消息，以检查它是否符合这些规则。
      </>
    );
  };

  render() {
    const { matchData, stream, streamRuleTypes, showStreamRuleForm } = this.state;
    const { currentUser, messageId, index } = this.props;
    const styles = (matchData ? this._getListClassName(matchData) : 'info');

    if (stream && streamRuleTypes) {
      return (
        <Row className="content">
          <Col md={12} className="streamrule-sample-message">
            <h2>1. 加载消息以测试规则</h2>

            <div className="stream-loader">
              <LoaderTabs messageId={messageId}
                          index={index}
                          onMessageLoaded={this.onMessageLoaded} />
            </div>

            <hr />

            <div className="buttons pull-right">
              <Button bsStyle="success"
                      className="show-stream-rule"
                      onClick={this._onAddStreamRule}>
                添加流规则
              </Button>
              { showStreamRuleForm && (
                <StreamRuleForm title="新流规则"
                                onClose={() => this.setState({ showStreamRuleForm: false })}
                                streamRuleTypes={streamRuleTypes}
                                onSubmit={this._onStreamRuleFormSubmit} />
              ) }
            </div>

            <h2>2. 管理流规则 </h2>

            <MatchingTypeSwitcher stream={stream} onChange={this.loadData} />
            <Panel bsStyle={styles}>
              <StreamAlertHeader>{this._explainMatchResult()}</StreamAlertHeader>
              <StreamRuleList stream={stream}
                              streamRuleTypes={streamRuleTypes}
                              permissions={currentUser.permissions}
                              matchData={matchData} />
            </Panel>

            <p>
              <LinkContainer to={Routes.STREAMS}>
                <Button bsStyle="success">确定</Button>
              </LinkContainer>
            </p>
          </Col>
        </Row>
      );
    }

    return (
      <Row className="content">
        <StyledSpinner />
      </Row>
    );
  }
}

export default StreamRulesEditor;
