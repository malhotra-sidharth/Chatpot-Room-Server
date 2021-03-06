import { injectable } from 'smart-factory';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';
import { ModelModules, ModelTypes } from '../models';
import { UtilModules, UtilTypes } from '../utils';
import { ExtApiModules, ExtApiTypes } from '../extapis';
import { InvalidParamError } from '../errors';

injectable(EndpointModules.Roulette.Request,
  [ EndpointModules.Utils.WrapAync,
    ModelModules.Roulette.Request,
    UtilModules.Auth.DecryptMemberToken,
    ExtApiModules.AuthReq.MembersByNos ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    request: ModelTypes.Roulette.Request,
    decryptMemberToken: UtilTypes.Auth.DecryptMemberToken,
    membersByNos: ExtApiTypes.AuthReq.MembersByNos): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/roulette/:member_token/request',
    method: EndpointTypes.EndpointMethod.POST,
    handler: [
      wrapAsync(async (req, res, next) => {
        const memberToken = req.params['member_token'];
        if (!memberToken) throw new InvalidParamError('member_token required');

        const regionType = parseRegionType(req.body['region_type']);

        const member = decryptMemberToken(memberToken);
        if (member === null) throw new InvalidParamError('invalid member_token');

        const apiResp = await membersByNos([ member.member_no ]);
        if (apiResp.length === 0) throw new InvalidParamError('not existing member');

        const memberInfo = apiResp[0];
        const resp = await request({
          region_type: regionType,
          member_token: memberToken,
          member_no: member.member_no,
          member_region: memberInfo.region,
          max_roulette: memberInfo.max_roulette
        });

        res.status(200).json(resp);
      })
    ]
  }));

enum RegionType {
  ALL = 'ALL',
  FOREIGNER = 'FOREIGNER'
}
const parseRegionType = (expr: string) => {
  if (expr === 'ALL') return RegionType.ALL;
  else if (expr === 'FOREIGNER') return RegionType.FOREIGNER;
  throw new InvalidParamError('region_type must be ALL or FOREIGNER');
};


injectable(EndpointModules.Roulette.Status,
  [ EndpointModules.Utils.WrapAync,
    UtilModules.Auth.DecryptMemberToken,
    ModelModules.Roulette.FetchStatuses ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    decryptMemberToken: UtilTypes.Auth.DecryptMemberToken,
    fetchStatuses: ModelTypes.Roulette.FetchStatuses): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/roulette/:member_token/requests',
    method: EndpointTypes.EndpointMethod.GET,
    handler: [
      wrapAsync(async (req, res, next) => {
        const memberToken = req.params['member_token'];
        if (!memberToken) throw new InvalidParamError('member_token required');

        const member = decryptMemberToken(memberToken);
        if (member === null) throw new InvalidParamError('invalid member_token');

        const statuses = await fetchStatuses({ member_no: member.member_no });
        res.status(200).json(statuses);
      })
    ]
  }));


injectable(EndpointModules.Roulette.Cancel,
  [ EndpointModules.Utils.WrapAync,
    UtilModules.Auth.DecryptMemberToken,
    ModelModules.Roulette.Cancel ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync,
    decryptMemberToken: UtilTypes.Auth.DecryptMemberToken,
    cancel: ModelTypes.Roulette.Cancel): Promise<EndpointTypes.Endpoint> =>

    ({
      uri: '/roulette/:member_token/request/:request_id',
      method: EndpointTypes.EndpointMethod.DELETE,
      handler: [
        wrapAsync(async (req, res, next) => {
          const requestId = req.params['request_id'];
          await cancel({ request_id: requestId });
          res.status(200).json({});
        })
      ]
    }));