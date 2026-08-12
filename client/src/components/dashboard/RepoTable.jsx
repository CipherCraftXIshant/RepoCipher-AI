import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  MoreHorizontal,
  ExternalLink,
  RotateCcw,
  Pencil,
  Trash2,
  Search,
  ArrowRight,
  FolderGit2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/Table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/DropdownMenu";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export function RepoTable({
  repos = [],
  _onOpenRepo,
  onReanalyze,
  onRename,
  onDelete,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [localRepos, setLocalRepos] = useState(repos);

  const filteredRepos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return localRepos;
    return localRepos.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.stack.some((s) => s.toLowerCase().includes(q))
    );
  }, [localRepos, searchQuery]);

  const handleDelete = (repo) => {
    if (window.confirm(`Remove ${repo.name} from recent repositories?`)) {
      setLocalRepos((prev) => prev.filter((r) => r.id !== repo.id));
      if (onDelete) onDelete(repo);
    }
  };

  const handleRename = (repo) => {
    const newName = window.prompt("Enter new display name for repository:", repo.name);
    if (newName && newName.trim()) {
      setLocalRepos((prev) =>
        prev.map((r) => (r.id === repo.id ? { ...r, name: newName.trim() } : r))
      );
      if (onRename) onRename(repo, newName.trim());
    }
  };

  const handleReanalyze = (repo) => {
    if (onReanalyze) {
      onReanalyze(repo);
    } else {
      alert(`Re-analyzing ${repo.name}...`);
    }
  };

  return (
    <Card className="border-slate-200/90 shadow-card overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Recent Repositories
            </CardTitle>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {filteredRepos.length}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Your recently audited repositories and inspection history.
          </p>
        </div>

        {/* Search filter input */}
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter repositories..."
            className="w-full pl-8.5 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500/30 transition-all"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {filteredRepos.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No repositories matching your search.
          </div>
        ) : (
          <>
            {/* Desktop Table View (Hidden on mobile) */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-slate-50/50">
                    <TableHead className="w-[35%]">Repository</TableHead>
                    <TableHead className="w-[30%]">Stack</TableHead>
                    <TableHead className="w-[20%]">Analyzed</TableHead>
                    <TableHead className="w-[15%] text-right pr-5">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRepos.map((repo) => (
                    <TableRow key={repo.id} className="group">
                      <TableCell className="font-medium">
                        <Link
                          to={`/app?repo=${encodeURIComponent(repo.fullName || repo.name)}`}
                          className="flex items-center gap-2.5 text-slate-900 group-hover:text-primary-600 font-semibold no-underline"
                        >
                          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                            <FolderGit2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span>{repo.name}</span>
                              {repo.healthScore && (
                                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/50">
                                  {repo.healthScore}%
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-normal text-slate-400 block">
                              {repo.fullName || `ciphercraft/${repo.name}`}
                            </span>
                          </div>
                        </Link>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {repo.stack.map((item) => (
                            <span
                              key={item}
                              className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell className="text-xs text-slate-500 font-medium">
                        {repo.analyzed}
                      </TableCell>

                      <TableCell className="text-right pr-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            as={Link}
                            to={`/app?repo=${encodeURIComponent(repo.fullName || repo.name)}`}
                            variant="ghost"
                            size="sm"
                            className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-2.5 py-1 rounded-lg"
                          >
                            Open
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-slate-400 hover:text-slate-700"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="right" className="w-36">
                              <DropdownMenuItem
                                onSelect={() => (window.location.href = `/app?repo=${encodeURIComponent(repo.fullName || repo.name)}`)}
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Open</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleReanalyze(repo)}>
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Re-analyze</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleRename(repo)}>
                                <Pencil className="w-3.5 h-3.5" />
                                <span>Rename</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                destructive
                                onSelect={() => handleDelete(repo)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Stacked Card View (Shown on small screens) */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredRepos.map((repo) => (
                <div key={repo.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/app?repo=${encodeURIComponent(repo.fullName || repo.name)}`}
                      className="flex items-center gap-2 text-slate-900 font-semibold text-sm no-underline"
                    >
                      <FolderGit2 className="w-4 h-4 text-slate-400" />
                      <span>{repo.name}</span>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="right" className="w-36">
                        <DropdownMenuItem
                          onSelect={() => (window.location.href = `/app?repo=${encodeURIComponent(repo.fullName || repo.name)}`)}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleReanalyze(repo)}>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Re-analyze</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleRename(repo)}>
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Rename</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          destructive
                          onSelect={() => handleDelete(repo)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {repo.stack.map((item) => (
                      <span
                        key={item}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Analyzed {repo.analyzed}</span>
                    <Link
                      to={`/app?repo=${encodeURIComponent(repo.fullName || repo.name)}`}
                      className="text-primary-600 font-semibold text-xs no-underline"
                    >
                      View analysis →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>

      {/* Footer Link */}
      <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
        <Link
          to="/app"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-primary-600 transition-colors no-underline"
        >
          <span>View all repositories</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
}
