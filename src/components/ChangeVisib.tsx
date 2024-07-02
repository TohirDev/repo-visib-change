import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useFetch } from "../hooks/useFetch";
import { getGithubUsername, getUserToken } from "../globals";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "beauty-ui-components";

interface Repo {
  name: string;
  private: boolean;
}

const ChangeVisib: React.FC = () => {
  const userName = getGithubUsername();
  const token = getUserToken();
  const navigate = useNavigate();
  const [repo, setRepo] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState<string>("false");
  const [fetchRepo, { data }] = useFetch<Repo[]>(
    `https://api.github.com/user/repos`,
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  useEffect(() => {
    if (!userName || !token) {
      navigate("/save-user");
    }
    fetchRepo();
  }, [fetchRepo, userName, token, navigate]);

  const handleRepoChange = (repoName: string) => {
    setRepo(repoName);
    const selectedRepo = data?.find((repo) => repo.name === repoName);
    if (selectedRepo) {
      setIsPrivate(selectedRepo.private.toString());
    }
  };

  const url = `https://api.github.com/repos/${userName}/${repo}`;

  const options = {
    method: "PATCH",
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      private: isPrivate === "true",
    }),
  };

  const changeVisib = async () => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(
          `Failed to change repository visibility. Status code: ${response.status}`
        );
      }
      await response.json();
      console.log(
        `Successfully changed repository visibility to ${isPrivate}`
      );
      fetchRepo(); // Refetch repositories
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Select onValueChange={handleRepoChange}>
        <SelectTrigger className="w-[300px] mt-2">
          <SelectValue placeholder="Select repository" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Repos</SelectLabel>
            {data?.map((repo, i) => (
              <SelectItem key={repo.name + i} value={repo.name}>
                {`${repo.name} ${repo.private ? "(Private)" : "(Public)"}`}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <RadioGroup
        value={isPrivate}
        onValueChange={setIsPrivate}
        className="mt-8"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="r1" />
          <Label htmlFor="r1">False</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id="r2" />
          <Label htmlFor="r2">True</Label>
        </div>
      </RadioGroup>
      <Button
        variant="default"
        sx={{ marginTop: "10px", width: "300px" }}
        onClick={() => {
          if (isPrivate.trim() !== "" && repo !== null) {
            changeVisib();
          }
        }}
      >
        Change
      </Button>
    </div>
  );
};

export default ChangeVisib;
