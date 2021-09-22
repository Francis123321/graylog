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

import { Link } from 'components/graylog/router';
import Routes from 'routing/Routes';
import DocsHelper from 'util/DocsHelper';
import DocumentationLink from 'components/support/DocumentationLink';
import HideOnCloud from 'util/conditional/HideOnCloud';

class NotificationsFactory {
  static getForNotification(notification) {
    switch (notification.type) {
      case 'check_server_clocks':
        return {
          title: '检查您的 Graylog 服务器节点的系统时钟。',
          description: (
            <span>
            Graylog 服务器节点检测到一种情况，即它在活动后立即被视为不活动。
        这通常表示系统时间的显着跳跃，例如 通过 NTP，或者第二个 Graylog 服务器节点在具有不同系统时间的系统上处于活动状态。
        请确保 graylog2 系统的时钟同步。
            </span>
      ),
    };
  case 'deflector_exists_as_index':
    return {
      title: 'Deflector 作为索引存在而不是别名。',
      description: (
        <span>
        偏转器是别名，但作为索引存在。 基础设施的多次故障可能导致这种情况。
    您的消息仍会被编入索引，但搜索和所有维护任务将失败或产生不正确的结果。
    强烈建议您尽快采取行动。
        </span>
  ),
  };
  case 'email_transport_configuration_invalid':
    return {
      title: '电子邮件传输配置丢失或无效！',
      description: (
        <span>
        电子邮件传输子系统的配置已显示丢失或无效。
        请检查您的 Graylog 服务器配置文件的相关部分。
        这是详细的错误消息： {notification.details.exception}
        </span>
  ),
  };
  case 'email_transport_failed':
    return {
      title: '尝试发送电子邮件时发生错误！ ',
      description: (
        <span>
        Graylog 服务器在尝试发送电子邮件时遇到错误。
        这是详细的错误消息： {notification.details.exception}
        </span>
  ),
  };
  case 'es_cluster_red':
    return {
      title: 'Elasticsearch 集群不健康 (RED) ',
      description: (
        <span>
        Elasticsearch 集群状态为 RED，这意味着未分配分片。
        这通常表示集群崩溃和损坏，需要进行调查。 Graylog 将写入本地磁盘日志。
        在 <DocumentationLink page={DocsHelper.PAGES.ES_CLUSTER_STATUS_RED} text="Elasticsearch 设置文档"/> 中阅读如何解决此问题。
      </span>
  ),
  };
  case 'es_open_files':
    return {
      title: '打开文件限制过低的 Elasticsearch 节点 ',
      description: (
        <span>
        集群中有 Elasticsearch 节点打开文件限制过低 (当前限制:{' '}
        <em>{notification.details.max_file_descriptors}</em> on <em>{notification.details.hostname}</em>;
    应该至少为 64000)
    这将导致难以诊断的问题。
    在 <DocumentationLink page={DocsHelper.PAGES.ES_OPEN_FILE_LIMITS} text="Elasticsearch 设置文档" /> 中阅读如何提高打开文件的最大数量。
  </span>
  ),
  };
  case 'es_unavailable':
    return {
      title: 'Elasticsearch 集群不可用',
      description: (
        <span>
        Graylog 无法成功连接到 Elasticsearch 集群。
    如果您使用的是多播，请检查它是否在您的网络中正常工作以及 Elasticsearch 是否可访问。
    还要检查集群名称设置是否正确。
    在 <DocumentationLink page={DocsHelper.PAGES.ES_CLUSTER_UNAVAILABLE} text="Elasticsearch 设置文档"/> 中阅读如何解决此问题。
      </span>
  ),
  };
  case 'gc_too_long':
    return {
      title: 'GC 暂停时间过长的节点',
      description: (
        <span>
        存在垃圾收集器运行时间过长的 Graylog 节点。垃圾收集运行时间应尽可能短。请检查这些节点是否健康。
      (节点: <em>{notification.node_id}</em>, GC 持续时间: <em>{notification.details.gc_duration_ms} ms</em>,
      GC阈值: <em>{notification.details.gc_threshold_ms} ms</em>)
    </span>
  ),
  };
  case 'generic':
    return {
      title: notification.details.title,
      description: notification.details.description,
    };
  case 'index_ranges_recalculation':
    return {
      title: '需要重新计算索引范围',
      description: (
        <span>
        索引范围不同步。
    请转到系统/指数并从{notification.details.index_sets ? (`以下索引集: ${notification.details.index_sets}`) : '所有索引集'}的维护菜单触发指数范围重新计算
  </span>
  ),
  };
  case 'input_failed_to_start':
    return {
      title: '输入无法启动',
      description: (
        <span>
        由于这个原因，输入 {notification.details.input_id} 未能在节点 {notification.node_id} 上启动:»{notification.details.reason}«.
    这意味着您无法从该输入接收任何消息。这主要是错误配置或错误的指示。
  <HideOnCloud>
    你可以点击<Link to={Routes.SYSTEM.INPUTS}>这里</Link>来解决这个问题。
      </HideOnCloud>
      </span>
  ),
  };
  case 'input_failure_shutdown':
    return {
      title: '由于故障，输入已关闭',
      description: (
        <span>
        由于这个原因，输入 {notification.details.input_title} 已在节点 {notification.node_id} 上关闭:»{notification.details.reason}«.
    这意味着您无法从该输入接收任何消息。这通常表示网络持续故障。
      您可以单击<Link to={Routes.SYSTEM.INPUTS}>此处</Link> 查看输入。
      </span>
  ),
  };
  case 'journal_uncommitted_messages_deleted':
    return {
        title: '从日志中删除未提交的消息',
        description: (
          <span>
          某些消息在写入 Elasticsearch 之前已从 Graylog 日志中删除。请验证您的 Elasticsearch 集群是否健康且速度足够快。
    您可能还想查看您的 Graylog 日志设置并设置更高的限制。 (节点: <em>{notification.node_id}</em>)
      </span>
  ),
  };
  case 'journal_utilization_too_high':
    return {
      title: '期刊利用率太高',
      description: (
        <span>
        日记帐利用率太高，可能很快就会超过限制。请验证您的 Elasticsearch 集群是否健康且速度足够快。
    您可能还想查看您的 Graylog 日志设置并设置更高的限制。
      (节点: <em>{notification.node_id}</em>)
    </span>
  ),
  };
  case 'multi_master':
    return {
      title: '集群中有多个Graylog server master',
      description: (
        <span>
        在您的 Graylog 集群中有多个 Graylog 服务器实例配置为主服务器。如果已经有一个主节点，集群会通过启动新节点作为从节点来自动处理这个问题，但你仍然应该解决这个问题。
        检查每个节点的 graylog.conf 并确保只有一个实例将 is_master 设置为 true。如果您认为问题已解决，请关闭此通知。如果您再次启动第二个主节点，它将重新弹出。
        </span>
  ),
  };
  case 'no_input_running':
    return {
      title: '有一个没有任何运行输入的节点。',
      description: (
        <span>
        有一个没有任何运行输入的节点。这意味着此时您没有收到来自该节点的任何消息。
    这很可能是错误或配置错误的指示。
        <HideOnCloud>
    你可以点击<Link to={Routes.SYSTEM.INPUTS}>这里</Link>来解决这个问题。
      </HideOnCloud>
      </span>
  ),
  };
  case 'no_master':
    return {
      title: '在集群中没有检测到主 Graylog 服务器节点。',
      description: (
        <span>
        Graylog 服务器的某些操作需要有一个主节点，但没有启动这样的主节点。
        请确保您的 Graylog 服务器节点之一在其配置中包含设置 <code>is_master = true</code> 并且它正在运行。
    在此解决之前，索引循环将无法运行，这意味着索引保留机制也未运行，从而导致索引大小增加。
    某些维护功能以及各种 Web 界面页面（例如仪表板）不可用。
    </span>
  ),
  };
  case 'outdated_version':
    return {
      title: '您运行的是过时的 Graylog 版本。',
      description: (
        <span>
    最新的稳定版 Graylog 是 <em>{notification.details.current_version}</em>。 从<a href="https://www.graylog.org/" target="_blank">https://www.graylog.org/</a>获取。
    </span>
  ),
  };
  case 'output_disabled':
    return {
      title: '输出禁用',
      description: (
        <span>
        流“{notification.details.streamTitle}”（id：{notification.details.streamId}）中 ID 为 {notification.details.outputId} 的输出已被禁用
    {notification.details.faultPenaltySeconds} 秒，因为有 { Notification.details.faultCount} 次失败。
    (节点: <em>{notification.node_id}</em>, 故障阈值: <em>{notification.details.faultCountThreshold}</em>)
  </span>
  ),
  };
  case 'output_failing':
    return {
      title: '输出失败',
      description: (
        <span>
        流“{notification.details.streamTitle}”（id：{notification.details.streamId}）中的输出“{notification.details.outputTitle}”
  （id：{notification.details.outputId}）无法将消息发送到 配置的目的地。
    <br />
    输出的错误消息是：<em>{notification.details.errorMessage}</em>
    </span>
  ),
  };
  case 'stream_processing_disabled':
    return {
      title: '由于处理时间过长，流的处理已被禁用。',
      description: (
        <span>
        流 <em>{notification.details.stream_title} ({notification.details.stream_id})</em> 的处理时间太长了 {notification.details.fault_count} 次。
      为保护消息处理的稳定性，此流已被禁用。
    请更正流规则并重新启用流。
    查看 <DocumentationLink page={DocsHelper.PAGES.STREAM_PROCESSING_RUNTIME_LIMITS} text="文件 " /> 了解更多详情。
    for more details.
    </span>
  ),
  };
  case 'es_node_disk_watermark_low':
    return {
      title: 'Elasticsearch 节点磁盘使用率高于低水位线',
      description: (
        <span>
        集群中有 Elasticsearch 节点磁盘空间不足，它们的磁盘使用率高于低水位线。{' '}
        因此，Elasticsearch 不会向受影响的节点分配新的分片。{' '}
        受影响的节点是： [{notification.details.nodes}]{' '}
        点击<a href="https://www.elastic.co/guide/en/elasticsearch/reference/master/disk-allocator.html" target="_blank">https://www.elastic.co/guide/en/elasticsearch/reference/master/disk-allocator.html</a>{' '}查看更多细节。
    </span>
  ),
  };
  case 'es_node_disk_watermark_high':
    return {
      title: 'Elasticsearch 节点磁盘使用率高于高水位线',
      description: (
        <span>
        集群中有Elasticsearch节点，几乎没有空闲磁盘，磁盘使用率高于高水位线。{' '}
    出于这个原因，Elasticsearch 将尝试将分片从受影响的节点重新定位。{' '}
    受影响的节点是： [{notification.details.nodes}]{' '}
    点击 <a href="https://www.elastic.co/guide/en/elasticsearch/reference/master/disk-allocator.html" target="_blank">https://www.elastic.co/guide/en/elasticsearch/reference/master/disk-allocator.html</a>{' '}
    了解更多详情。
    </span>
  ),
  };
  case 'es_node_disk_watermark_flood_stage':
    return {
      title: 'Elasticsearch 节点磁盘使用率高于洪水阶段水印',
      description: (
        <span>
        集群中有没有空闲磁盘的Elasticsearch节点，它们的磁盘使用率在洪水阶段水印以上。{' '}
    出于这个原因，Elasticsearch 对在任何受影响节点中具有任何分片的所有索引强制执行只读索引块。
    受影响的节点是： [{notification.details.nodes}]{' '}
    点击 <a href="https://www.elastic.co/guide/en/elasticsearch/reference/master/disk-allocator.html" target="_blank">https://www.elastic.co/guide/en/elasticsearch/reference/master/disk-allocator.html</a>{' '}
    了解更多详情。
    </span>
  ),
  };
  case 'es_version_mismatch':
    const { initial_version: initialVersion, current_version: currentVersion } = notification.details;

    return {
      title: 'Elasticsearch 版本不兼容',
      description: (
        <span>
        当前运行的 Elasticsearch 版本 ({currentVersion}) 与启动 Graylog 主节点的主版本 ({initialVersion}) 具有不同的主要版本。{' '}
    这很可能会在索引或搜索过程中导致错误。在 Elasticsearch 从一个主要版本升级到另一个主要版本后，Graylog 需要完全重启。
        <br />
    有关详细信息，请参阅我们关于
        <DocumentationLink page={DocsHelper.PAGES.ROLLING_ES_UPGRADE}
      text="滚动 Elasticsearch 升级" />的说明。

      </span>
  ),
  };
  case 'legacy_ldap_config_migration':
    const { auth_service_id: authServiceId } = notification.details;
    const authServiceLink = <Link to={Routes.SYSTEM.AUTHENTICATION.BACKENDS.show(authServiceId)}>Authentication Service</Link>;

    return {
        title: '旧 LDAP/Active Directory 配置已迁移到身份验证服务',
        description: (
          <span>
          此系统的旧 LDAP/Active Directory 配置已升级到新的 {authServiceLink}。
          由于新的 {authServiceLink} 需要一些旧配置中不存在的信息，因此 {authServiceLink} <strong>需要人工审核</strong>！
      <br />
      <br />
      <strong>查看 {authServiceLink} 后，必须启用它以允许 LDAP 或 Active Directory 用户再次登录！
    </strong>
    <br />
    <br />
    请点击<DocumentationLink page={DocsHelper.PAGES.UPGRADE_GUIDE} text="升级指南" />查看更多细节。
    </span>
  ),
  };
  default:
    return { title: `unknown (${notification.type})`, description: 'unknown' };
  }
  }
}

export default NotificationsFactory;

