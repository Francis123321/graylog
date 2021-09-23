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
import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import { Button, Modal, Well } from 'components/graylog';
import { Icon } from 'components/common';
import DocumentTitle from 'components/common/DocumentTitle';
import authStyles from 'theme/styles/authStyles';
import { qualifyUrl } from 'util/URLUtils';

const StyledIcon = styled(Icon)`
  margin-left: 6px;
`;

const ServerUnavailableStyles = createGlobalStyle`
  ${authStyles}
`;

const ServerUnavailablePage = ({ server }) => {
  const [showDetails, setShowDetails] = useState(false);

  const _toggleDetails = () => setShowDetails(!showDetails);

  const _formatErrorMessage = () => {
    if (!showDetails) {
      return null;
    }

    const noInformationMessage = (
      <div>
        <hr />
        <p>没有可用的信息。</p>
      </div>
    );

    if (!server?.error) {
      return noInformationMessage;
    }

    const { error } = server;

    const errorDetails = [];

    if (error.message) {
      errorDetails.push(<dt key="error-title">错误信息</dt>, <dd key="error-desc">{error.message}</dd>);
    }

    if (error.originalError) {
      const { originalError } = error;

      errorDetails.push(
        <dt key="status-original-request-title">原始请求</dt>,
        <dd key="status-original-request-content">{String(originalError.method)} {String(originalError.url)}</dd>,
      );

      errorDetails.push(
        <dt key="status-code-title">状态码</dt>,
        <dd key="status-code-desc">{String(originalError.status)}</dd>,
      );

      if (typeof originalError.toString === 'function') {
        errorDetails.push(
          <dt key="full-error-title">完整的错误信息</dt>,
          <dd key="full-error-desc">{originalError.toString()}</dd>,
        );
      }
    }

    if (errorDetails.length === 0) {
      return noInformationMessage;
    }

    return (
      <div>
        <hr style={{ marginTop: 10, marginBottom: 10 }} />
        <p>这是我们从服务器收到的最后一个响应：</p>
        <Well bsSize="small" style={{ whiteSpace: 'pre-line' }}>
          <dl style={{ marginBottom: 0 }}>
            {errorDetails}
          </dl>
        </Well>
      </div>
    );
  };

  return (
    <DocumentTitle title="Server unavailable">
      <ServerUnavailableStyles />
      <Modal show>
        <Modal.Header>
          <Modal.Title><Icon name="exclamation-triangle" />服务器当前不可用</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>
              我们在连接到 <i>{qualifyUrl('')}</i> 上运行的 Graylog 服务器时遇到问题。
              请验证服务器是否健康并正常工作。
            </p>
            <p>一旦我们可以连接到服务器，您将被自动重定向到上一页。</p>
            <p>
              您需要帮助么？{' '}
              <a href="https://www.graylog.org/community-support" rel="noopener noreferrer" target="_blank">我们可以为您提供帮助</a>.
            </p>
            <div>
              <Button bsStyle="primary"
                      tabIndex={0}
                      onClick={_toggleDetails}
                      bsSize="sm">
                {showDetails ? '更少' : '更多'}
                <StyledIcon name={showDetails ? 'chevron-up' : 'chevron-down'} />
              </Button>
              {_formatErrorMessage()}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </DocumentTitle>
  );
};

ServerUnavailablePage.propTypes = {
  server: PropTypes.object,
};

ServerUnavailablePage.defaultProps = {
  server: undefined,
};

export default ServerUnavailablePage;
