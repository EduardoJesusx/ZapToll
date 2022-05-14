import { NextApiHandler } from 'next'

import { api } from '../../services/api'

const handler: NextApiHandler = async (request, response) => {
  // const {
  //   name,
  //   shortName,
  //   pushname,
  //   type,
  //   isBusiness,
  //   isEnterprise,
  //   statusMute,
  //   labels,
  //   disappearingModeDuration,
  //   disappearingModeSettingTimestamp,
  //   formattedName,
  //   displayName,
  //   formattedShortName,
  //   formattedShortNameWithNonBreakingSpaces,
  //   isMe,
  //   mentionName,
  //   notifyName,
  //   isMyContact,
  //   isPSA,
  //   isUser,
  //   isWAContact,
  //   profilePicThumbObj,
  //   msgs,
  // } = request.query

  // console.log(name)

  const { data } = await api.get('/')

  return response.json(data)
}

export default handler
