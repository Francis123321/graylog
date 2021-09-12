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
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Col, ControlLabel, FormControl, FormGroup, Row } from 'components/graylog';
import { ConfirmLeaveDialog, SourceCodeEditor } from 'components/common';
import { Input } from 'components/bootstrap';
import Routes from 'routing/Routes';
import history from 'util/History';

import { PipelineRulesContext } from './RuleContext';
import PipelinesUsingRule from './PipelinesUsingRule';

const RuleForm = ({ create }) => {
  const {
    descriptionRef,
    handleDescription,
    handleSavePipelineRule,
    ruleSourceRef,
    onAceLoaded,
    onChangeSource,
    ruleSource,
  } = useContext(PipelineRulesContext);

  const [isDirty, setIsDirty] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    handleSavePipelineRule(() => {
      setIsDirty(false);
      history.goBack();
    });
  };

  const handleApply = () => {
    handleSavePipelineRule((rule) => {
      setIsDirty(false);
      history.replace(Routes.SYSTEM.PIPELINES.RULE(rule.id));
    });
  };

  const handleDescriptionChange = (event) => {
    setIsDirty(true);
    handleDescription(event.target.value);
  };

  const handleSourceChange = (newSource) => {
    setIsDirty(true);
    onChangeSource(newSource);
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <FormGroup id="ruleTitleInformation">
          <ControlLabel>标题</ControlLabel>
          <FormControl.Static>您可以在规则源中设置规则标题。 有关更多信息，请参阅快速参考。</FormControl.Static>
        </FormGroup>

        {isDirty && (
          <ConfirmLeaveDialog question="您真的要放弃此页面并丢失您的更改吗？ 此操作无法撤消。" />
        )}

        <Input type="textarea"
               id="description"
               label="描述"
               onChange={handleDescriptionChange}
               autoFocus
               defaultValue={descriptionRef?.current?.value}
               help="规则描述（可选）。"
               ref={descriptionRef} />

        <PipelinesUsingRule create={create} />

        <Input id="rule-source-editor" label="规则来源" help="规则来源，请参阅快速参考以获取更多信息。">
          <SourceCodeEditor id={`source${create ? '-create' : '-edit'}`}
                            mode="pipeline"
                            onLoad={onAceLoaded}
                            onChange={handleSourceChange}
                            value={ruleSource}
                            innerRef={ruleSourceRef} />
        </Input>
      </fieldset>

      <Row>
        <Col md={12}>
          <div className="form-group">
            <Button type="submit" bsStyle="primary" style={{ marginRight: 10 }}>保存并且关闭</Button>
            <Button type="button" bsStyle="info" style={{ marginRight: 10 }} onClick={handleApply}>申请</Button>
            <Button type="button" onClick={handleCancel}>取消</Button>
          </div>
        </Col>
      </Row>
    </form>
  );
};

RuleForm.propTypes = {
  create: PropTypes.bool,
};

RuleForm.defaultProps = {
  create: false,
};

export default RuleForm;
