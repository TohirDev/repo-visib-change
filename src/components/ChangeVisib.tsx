import React, { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { getGithubUsername, getUserToken } from "../globals";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button, Typography } from "beauty-ui-components";
import { useToast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";

interface Repo {
  name: string;
  private: boolean;
}

const ChangeVisib: React.FC = () => {
  const { toast } = useToast();
  const userName = getGithubUsername();
  const token = getUserToken();
  const navigate = useNavigate();
  const [repo, setRepo] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<string>("false");
  const [data, setData] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchRepo = useCallback(async () => {
    setLoading(true);
    const url = "https://api.github.com/user/repos";

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const repos = await response.json();
      setData(repos);
    } catch (error) {
      console.error("Error fetching user repositories:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!userName || !token) {
      navigate("/save-user");
    } else {
      fetchRepo();
    }
  }, [fetchRepo, userName, token, navigate]);

  const handleRepoChange = (repoName: string) => {
    setRepo(repoName);
    const selectedRepo = data.find((repo) => repo.name === repoName);
    if (selectedRepo) {
      setIsPrivate(selectedRepo.private.toString());
    }
  };

  const changeVisib = async () => {
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

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(
          `Failed to change repository visibility. Status code: ${response.status}`
        );
      }
      await response.json();
      toast({
        title: "Repository Changed",
        description: `Your repository visibility changed to ${
          isPrivate === "true" ? "Private" : "Public"
        }`,
        variant: "default",
      });
      await fetchRepo();
      handleRepoChange(repo);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
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
      <Typography
        variant="h3"
        sx={{ width: "500px", textAlign: "center", marginTop: "20px" }}
      >
        Here you can change the visibility of your repo. After clicking
        Change, click Refetch button to refetch data
      </Typography>
      <Toaster />
      <Select onValueChange={handleRepoChange}>
        <SelectTrigger className="w-[300px] mt-2">
          <SelectValue placeholder="Select repository" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Repos</SelectLabel>
            {data.map((repo, i) => (
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
        disabled={loading}
      >
        Change
      </Button>
      {/* <Button
        onClick={() => fetchRepo()}
        sx={{ width: "300px", marginTop: "10px" }}
      >
        Refetch
      </Button> */}
    </div>
  );
};

export default ChangeVisib;
