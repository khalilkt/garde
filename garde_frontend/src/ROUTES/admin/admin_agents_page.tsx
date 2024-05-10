import { Link, redirect, useParams, useSearchParams } from "react-router-dom";
import {
  FilledButton,
  SelectButton,
  SelectButtonTile,
} from "../../components/buttons";
import { Input, SearchBar, Title } from "../../components/comps";
import {
  DeleteIcon,
  EditIcon,
  FilterIcon,
  LeftArrow,
  LoadingIcon,
  MdpIcon,
  MoreIcon,
  PlusIcon,
} from "../../components/icons";
import { Pagination, Td, Tr } from "../../components/table";
import { useContext, useEffect, useId } from "react";
import React from "react";
import { MDialog } from "../../components/dialog";
import axios from "axios";
import { PaginatedData, rootUrl } from "../../models/constants";
import { AuthContext } from "../../App";

interface PirogueInterface {
  id: number;
  created_by_name: string;
  immigrants_count: number;
  lat: string;
  long: string;
  number: string;
  departure: string;
  destination: string;
  description: string;
  created_at: string;
  created_by: number;
}

interface AgentInterface {
  id: number;
  total_pirogues: number;
  total_immigrants: number;
  last_login: number;
  username: string;
  name: string;
  is_admin: boolean;
  is_superuser: boolean;
  is_active: boolean;
}

const NAME_INPUT_ID = "agent_name_dialog";
const USERNAME_INPUT_ID = "agent_username_dialog";
const PASSWORD_INPUT_ID = "agent_password_dialog";

const PASSWORDCHANGE_INPUT_ID = "agent_passwordchange_dialog";
const PASSWORDCHANGE_CONFIRM_INPUT_ID = "agent_passwordchange_confirm_dialog";

interface DialogState {
  state: "none" | "adding" | "editing" | "password_change";
  payload?: {
    [key: string]: any;
  };
}

export default function AdminAgentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTimer = React.useRef<NodeJS.Timeout>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [dialogState, setDialogState] = React.useState<DialogState>({
    state: "none",
  });
  const [data, setData] = React.useState<PaginatedData<AgentInterface> | null>(
    null,
  );

  const token = useContext(AuthContext).authData?.token;

  async function load() {
    let url = rootUrl + "users";
    if (searchParams.size > 0) {
      url += "?" + searchParams.toString();
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setData(response.data);
    } catch (e) {
      console.log(e);
    }
  }
  async function create() {
    try {
      const name = document.getElementById(NAME_INPUT_ID) as HTMLInputElement;
      const username = document.getElementById(
        USERNAME_INPUT_ID,
      ) as HTMLInputElement;
      const password = document.getElementById(
        PASSWORD_INPUT_ID,
      ) as HTMLInputElement;
      if (!name || !username || !password) {
        return;
      }
      if (
        name.value.length === 0 ||
        username.value.length === 0 ||
        password.value.length === 0
      ) {
        alert("Veuillez remplir tous les champs");
        return;
      }
      setIsSubmitting(true);
      await axios.post(
        rootUrl + "users/",
        {
          name: name.value,
          username: username.value,
          password: password.value,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      setDialogState({ state: "none" });
      load();
    } catch (e) {
      alert("Erreur lors de la création de l'agent");
    }
    setIsSubmitting(false);
  }

  async function updatePassword(userId: number) {
    try {
      const passwordInput = document.getElementById(
        PASSWORDCHANGE_INPUT_ID,
      ) as HTMLInputElement;
      const confirmPassordInput = document.getElementById(
        PASSWORDCHANGE_CONFIRM_INPUT_ID,
      ) as HTMLInputElement;

      if (!passwordInput || !confirmPassordInput) {
        return;
      }
      if (
        passwordInput.value.length === 0 ||
        confirmPassordInput.value.length === 0
      ) {
        alert("Veuillez remplir tous les champs");
        return;
      }
      if (passwordInput.value !== confirmPassordInput.value) {
        alert("Les mots de passe ne correspondent pas");
        return;
      }
      setIsSubmitting(true);

      await axios.post(
        rootUrl + `users/${userId}/update_password/`,
        {
          password: passwordInput.value,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      setDialogState({ state: "none" });
    } catch (e) {
      alert("Erreur lors de la mise à jour du mot de passe");
    }
    setIsSubmitting(false);
  }

  async function openEditDialog(agent: AgentInterface) {
    setDialogState({ state: "editing" });

    await new Promise((resolve) => setTimeout(resolve, 10));
    const name = document.getElementById(NAME_INPUT_ID) as HTMLInputElement;
    const username = document.getElementById(
      USERNAME_INPUT_ID,
    ) as HTMLInputElement;

    if (!name || !username) {
      alert("dialog not open yet");
      return;
    }
    name.value = agent.name;
    username.value = agent.username;
  }

  useEffect(() => {
    load();
  }, [searchParams]);

  function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const search = e.target.value;
    clearTimeout(searchTimer.current!);
    searchTimer.current = setTimeout(() => {
      setSearchParams((params) => {
        params.set("page", "1");
        if (search.length === 0) {
          params.delete("search");
        } else {
          params.set("search", search);
        }
        return params;
      });
    }, 500);
  }

  useEffect(() => {
    const searchBar = document.getElementById("agents_search_bar");
    const searchParam = searchParams.get("search");
    if (searchBar) {
      (searchBar as HTMLInputElement).value = searchParam ?? "";
    }
  }, []);

  function PasswordChangeDialog({ userId }: { userId: number }) {
    return (
      <div className="grid w-[400px] grid-cols-2 gap-x-4 gap-y-6">
        <Input
          className="col-span-2"
          type="password"
          id={PASSWORDCHANGE_INPUT_ID}
          placeholder="Mot de passe"
        />
        <Input
          className="col-span-2"
          type="password"
          id={PASSWORDCHANGE_CONFIRM_INPUT_ID}
          placeholder="Confirmer le mot de passe"
        />
        <FilledButton
          onClick={() => {
            setDialogState({ state: "none" });
          }}
          isLight={true}
          className="col-span-1"
        >
          Annuler
        </FilledButton>
        <FilledButton
          onClick={() => {
            updatePassword(userId);
          }}
          className="col-span-1"
        >
          Changer
        </FilledButton>
      </div>
    );
  }

  function AddEditAgentDialog() {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        <Input id={NAME_INPUT_ID} placeholder="Nom" />
        <Input id={USERNAME_INPUT_ID} placeholder="Nom d'utilisateur" />
        {dialogState.state === "adding" && (
          <Input
            id={PASSWORD_INPUT_ID}
            className=" col-span-2"
            placeholder="Mot de passe"
            type="password"
          />
        )}
        <FilledButton
          onClick={() => {
            setDialogState({ state: "none" });
          }}
          isLight={true}
          className="col-span-1"
        >
          Annuler
        </FilledButton>
        <FilledButton
          disabled={isSubmitting}
          onClick={create}
          className="col-span-1"
        >
          {isSubmitting ? <LoadingIcon /> : "Ajouter"}
        </FilledButton>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <MDialog
        onClose={() => setDialogState({ state: "none" })}
        isOpen={dialogState.state !== "none"}
        title={
          dialogState.state === "editing"
            ? "Modifier Agent"
            : dialogState.state === "password_change"
              ? "Changer mot de passe"
              : "Ajouter Agent"
        }
      >
        {dialogState.state === "password_change" ? (
          <PasswordChangeDialog userId={dialogState.payload!.userId} />
        ) : (
          <AddEditAgentDialog />
        )}
      </MDialog>
      <Title className="mb-10">Agents</Title>
      <div className="flex w-full flex-row justify-between">
        <SearchBar
          id="agents_search_bar"
          onChange={onSearchChange}
          placeholder="Chercher agents"
          className="w-[300px]"
        />
        <div className="flex w-max flex-row gap-x-4">
          <FilledButton
            onClick={() => {
              setDialogState({ state: "adding" });
            }}
            isLight={true}
            className="w-max"
          >
            <span>Nouveau Agent</span> <PlusIcon />
          </FilledButton>
        </div>
      </div>
      <div className="mt-10">
        <table className="w-full text-center text-lg">
          <thead className="">
            <tr className="font-bold text-gray">
              <th className="text-medium  py-3 text-base">Agent</th>
              <th className="text-medium  py-3 text-base">Nom d'utilisateur</th>
              <th className="text-medium py-3 text-base">Dernière Connexion</th>
              <th className="text-medium py-3 text-base">Pirogues</th>
              <th className="text-medium py-3 text-base">Migrants</th>
              <th className="text-medium w-20  py-3 text-base"></th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((agent, i) => (
              <Tr>
                {/* <Td>
                  <input type="checkbox" className="h-5 w-5" />
                </Td> */}
                <Td>{agent.name}</Td>
                <Td>{agent.username}</Td>
                <Td>{agent.last_login ?? "-"}</Td>
                <Td>{agent.total_pirogues}</Td>
                <Td>{agent.total_immigrants}</Td>
                <Td>
                  <SelectButton button={<MoreIcon />}>
                    <SelectButtonTile
                      onClick={() => {
                        openEditDialog(agent);
                      }}
                      icon={<EditIcon />}
                    >
                      <span>Modifier</span>
                    </SelectButtonTile>
                    <SelectButtonTile
                      onClick={() => {
                        axios
                          .delete(rootUrl + `users/${agent.id}/`, {
                            headers: {
                              Authorization: `Token ${token}`,
                            },
                          })
                          .then(() => {
                            load();
                          })
                          .catch(() => {
                            alert("Erreur lors de la suppression de l'agent");
                          });
                      }}
                      icon={<DeleteIcon />}
                    >
                      <span>Supprimer</span>
                    </SelectButtonTile>
                    <SelectButtonTile
                      onClick={() => {
                        setDialogState({
                          state: "password_change",
                          payload: { userId: agent.id },
                        });
                      }}
                      icon={<MdpIcon />}
                    >
                      <span>Changer mdp</span>
                    </SelectButtonTile>
                  </SelectButton>
                </Td>
              </Tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        className="mt-10"
        onItemClick={(page) => {
          setSearchParams((params) => {
            params.set("page", page.toString());
            return params;
          });
        }}
        current={
          searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1
        }
        total={data?.total_pages ?? 1}
      />
    </div>
  );
}
