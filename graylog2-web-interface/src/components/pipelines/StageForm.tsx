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
import React, { useCallback, useMemo, useRef, useState } from 'react';

import { useStore } from 'stores/connect';
import { Link } from 'components/graylog/router';
import { Button, ControlLabel, FormGroup } from 'components/graylog';
import { SelectableList } from 'components/common';
import { BootstrapModalForm, Input } from 'components/bootstrap';
import { getValueFromInput } from 'util/FormsUtils';
import Routes from 'routing/Routes';
import CombinedProvider from 'injection/CombinedProvider';
import { PipelineType, StageType } from 'stores/pipelines/PipelinesStore';

const { RulesStore } = CombinedProvider.get('Rules');

type Props = {
  pipeline: PipelineType,
  stage?: StageType,
  create: boolean,
  save: (nextStage: StageType, callback: () => void) => void,
};

const StageForm = ({ pipeline, stage, create, save }: Props) => {
  const modalRef = useRef<BootstrapModalForm>();

  const _initialStageNumber = useMemo(() => (
    create ? Math.max(...pipeline.stages.map((s) => s.stage)) + 1 : stage.stage
  ), [create, pipeline.stages, stage.stage]);

  const [nextStage, setNextStage] = useState<StageType>({ ...stage, stage: _initialStageNumber });
  const { rules } = useStore(RulesStore);

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.open();
    }
  };

  const _onChange = ({ target }) => {
    setNextStage((currentStage) => ({ ...currentStage, [target.name]: getValueFromInput(target) }));
  };

  const _onRulesChange = (newRules) => {
    setNextStage((currentStage) => ({ ...currentStage, rules: newRules }));
  };

  const _closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  const _onSaved = () => {
    _closeModal();
  };

  const isOverridingStage = useMemo(() => (
    nextStage.stage !== _initialStageNumber && pipeline.stages.some(({ stage: s }) => s === nextStage.stage)
  ), [nextStage.stage, _initialStageNumber, pipeline.stages]);

  const _handleSave = () => {
    if (!isOverridingStage) {
      save(nextStage, _onSaved);
    }
  };

  const _formatRuleOption = ({ title }) => {
    return { value: title, label: title };
  };

  const _filterChosenRules = (rule, chosenRules) => {
    return !chosenRules.includes(rule.title);
  };

  const _getFormattedOptions = useCallback(() => {
    const chosenRules = nextStage.rules;

    return rules ? rules.filter((rule) => _filterChosenRules(rule, chosenRules)).map(_formatRuleOption) : [];
  }, [nextStage.rules, rules]);

  const rulesHelp = (
    <span>
      选择在此阶段评估的规则，或在 <Link to={Routes.SYSTEM.PIPELINES.RULES}>Pipeline Rules 页面</Link> 中创建一个。
    </span>
  );

  return (
    <span>
      <Button onClick={openModal}
              bsStyle={create ? 'success' : 'info'}>
        {create ? '添加新阶段' : '编辑'}
      </Button>
      <BootstrapModalForm ref={modalRef}
                          title={`${create ? 'Add new' : 'Edit'} stage ${nextStage.stage}`}
                          onSubmitForm={_handleSave}
                          submitButtonText="Save">
        <fieldset>
          <Input type="number"
                 id="stage"
                 name="stage"
                 label="阶段"
                 autoFocus
                 onChange={_onChange}
                 bsStyle={isOverridingStage ? 'error' : null}
                 help={isOverridingStage
                   ? '舞台已在使用中，请使用其他号码或编辑现有舞台。'
                   : '阶段优先。 数字越小，执行得越早。'}
                 value={nextStage.stage} />

          <FormGroup>
            <ControlLabel>下一个阶段继续处理时</ControlLabel>
          </FormGroup>

          <Input type="radio"
                 id="match_all"
                 name="match_all"
                 value="true"
                 label="此阶段的所有规则都与消息匹配"
                 onChange={_onChange}
                 checked={nextStage.match_all} />

          <Input type="radio"
                 id="match_any"
                 name="match_all"
                 value="false"
                 label="此阶段至少有一条规则与消息匹配"
                 onChange={_onChange}
                 checked={!nextStage.match_all} />

          <Input id="stage-rules-select"
                 label="阶段规则"
                 help={rulesHelp}>
            <SelectableList options={_getFormattedOptions()}
                            isLoading={!rules}
                            onChange={_onRulesChange}
                            selectedOptions={nextStage.rules} />
          </Input>
        </fieldset>
      </BootstrapModalForm>
    </span>
  );
};

StageForm.propTypes = {
  pipeline: PropTypes.object.isRequired,
  stage: PropTypes.object,
  create: PropTypes.bool,
  save: PropTypes.func.isRequired,
};

StageForm.defaultProps = {
  create: false,
  stage: {
    stage: 0,
    match_all: false,
    rules: [],
  },
};

export default StageForm;
