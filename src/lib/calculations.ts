export function calcAttribution(creatorStreams: number, platformStreams: number) {
  return platformStreams > 0 ? creatorStreams / platformStreams : 0;
}

export function calcGrossSVOD(pool: number, attribution: number) {
  return pool * attribution;
}

export function calcCreatorPayout(grossTotal: number, share: number) {
  return grossTotal * share;
}

export function calcPlatformFee(grossTotal: number, share: number) {
  return grossTotal * (1 - share);
}
