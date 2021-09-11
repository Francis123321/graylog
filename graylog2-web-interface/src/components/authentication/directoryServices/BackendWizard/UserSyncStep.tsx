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
import * as Immutable from 'immutable';
import { useContext } from 'react';
import { Formik, Form, Field, FormikProps } from 'formik';

import Role from 'logic/roles/Role';
import { validateField, formHasErrors } from 'util/FormsUtils';
import { Alert, Button, ButtonToolbar, Row, Col, Panel } from 'components/graylog';
import { Icon, FormikFormGroup, Select } from 'components/common';
import { Input } from 'components/bootstrap';

import BackendWizardContext, { WizardFormValues } from './BackendWizardContext';

export const STEP_KEY = 'user-synchronization';
// Form validation needs to include all input names
// to be able to associate backend validation errors with the form
export const FORM_VALIDATION = {
  defaultRoles: { required: true },
  userFullNameAttribute: { required: true },
  userNameAttribute: { required: true },
  userSearchBase: { required: true },
  userSearchPattern: { required: true },
  userUniqueIdAttribute: {},
};

type Props = {
  formRef: React.Ref<FormikProps<WizardFormValues>>,
  help: { [inputName: string]: React.ReactElement | string | null | undefined },
  excludedFields: { [inputName: string]: boolean },
  roles: Immutable.List<Role>,
  onSubmit: () => void,
  onSubmitAll: () => Promise<void>,
  submitAllError: React.ReactNode | null | undefined,
  validateOnMount: boolean,
};

const UserSyncStep = ({ help = {}, excludedFields = {}, formRef, onSubmit, onSubmitAll, submitAllError, validateOnMount, roles }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { setStepsState, ...stepsState } = useContext(BackendWizardContext);
  const { backendValidationErrors } = stepsState;
  const rolesOptions = roles.map((role) => ({ label: role.name, value: role.id })).toArray();

  const _onSubmitAll = (validateForm) => {
    validateForm().then((errors) => {
      if (!formHasErrors(errors)) {
        onSubmitAll();
      }
    });
  };

  return (
    <Formik initialValues={stepsState.formValues}
            initialErrors={backendValidationErrors}
            innerRef={formRef}
            onSubmit={onSubmit}
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount={validateOnMount}>
      {({ isSubmitting, validateForm }) => (
        <Form className="form form-horizontal">
          <FormikFormGroup help={help.userSearchBase}
                           label="搜索基础 DN"
                           error={backendValidationErrors?.userSearchBase}
                           name="userSearchBase"
                           placeholder="搜索基础 DN"
                           validate={validateField(FORM_VALIDATION.userSearchBase)} />

          <FormikFormGroup help={help.userSearchPattern}
                           label="搜索模式"
                           name="userSearchPattern"
                           error={backendValidationErrors?.userSearchPattern}
                           placeholder="搜索模式"
                           validate={validateField(FORM_VALIDATION.userSearchPattern)} />

          <FormikFormGroup help={help.userNameAttribute}
                           label="名称属性"
                           name="userNameAttribute"
                           error={backendValidationErrors?.userNameAttribute}
                           placeholder="名称属性"
                           validate={validateField(FORM_VALIDATION.userNameAttribute)} />

          <FormikFormGroup help={help.userFullNameAttribute}
                           label="全名属性"
                           name="userFullNameAttribute"
                           placeholder="全名属性"
                           error={backendValidationErrors?.userFullNameAttribute}
                           validate={validateField(FORM_VALIDATION.userFullNameAttribute)} />

          {!excludedFields.userUniqueIdAttribute && (
            <FormikFormGroup help={help.userUniqueIdAttribute}
                             label="身份属性"
                             name="userUniqueIdAttribute"
                             placeholder="身份属性"
                             error={backendValidationErrors?.userUniqueIdAttribute}
                             validate={validateField(FORM_VALIDATION.userUniqueIdAttribute)} />
          )}

          <Row>
            <Col sm={9} smOffset={3}>
              <Panel bsStyle="info">
                更改静态角色分配只会影响通过{stepsState.authBackendMeta.serviceTitle}创建的新用户！ 现有用户帐户将在下次登录时更新，或者如果您手动编辑他们的角色。
              </Panel>
            </Col>
          </Row>

          <Field name="defaultRoles" validate={validateField(FORM_VALIDATION.defaultRoles)}>
            {({ field: { name, value, onChange, onBlur }, meta: { error } }) => (
              <Input bsStyle={error ? 'error' : undefined}
                     help={help.defaultRoles}
                     error={error ?? backendValidationErrors?.defaultRoles}
                     id="default-roles-select"
                     label="默认角色"
                     labelClassName="col-sm-3"
                     wrapperClassName="col-sm-9">
                <Select inputProps={{ 'aria-label': 'Search for roles' }}
                        multi
                        onBlur={onBlur}
                        onChange={(selectedRoles) => onChange({ target: { value: selectedRoles, name } })}
                        options={rolesOptions}
                        placeholder="搜索角色"
                        value={value} />
              </Input>
            )}
          </Field>

          <Row>
            <Col sm={9} smOffset={3}>
              <Alert bsStyle="info">
                <Icon name="info-circle" />{' '}
                我们建议您在侧边栏面板中测试您的用户登录以验证您的设置。
              </Alert>
            </Col>
          </Row>

          {submitAllError}

          <ButtonToolbar className="pull-right">
            <Button disabled={isSubmitting}
                    onClick={() => _onSubmitAll(validateForm)}
                    type="button">
              完成并保存身份服务
            </Button>
            <Button bsStyle="primary"
                    disabled={isSubmitting}
                    type="submit">
              下一步：群组同步
            </Button>
          </ButtonToolbar>
        </Form>
      )}
    </Formik>
  );
};

export default UserSyncStep;
