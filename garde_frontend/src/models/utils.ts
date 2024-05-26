import { ImmigrantInterface } from "../ROUTES/admin/agent&admin_immigrants_page";

export const ss = 1;

export function getImmigrantGenre(imm: ImmigrantInterface) {
  let ret = "";
  if (imm.is_male) {
    ret = "H";
  } else {
    ret = "F";
  }
  if (imm.age && imm.age < 18) {
    ret += "m";
  }
  return ret;
}

export function getImmigrantSejour(imm: ImmigrantInterface) {
  let ret = "";

  if (imm.sejour) {
    ret = imm.sejour.toString();
  } else if (imm.pirogue_sejour) {
    ret = imm.pirogue_sejour.toString();
  }
  if (ret.length > 0) {
    ret += " jour(s)";
  } else {
    ret = "-";
  }
  return ret;
}
