import { Plus, Minus } from "lucide-react";

interface PlayerField {
  name: string;
  branch: string;
  semester: string;
}

interface RegistrationFormFieldsProps {
  // Team Leader Fields
  teamLeaderName: string;
  setTeamLeaderName: (value: string) => void;
  teamLeaderEmail: string;
  setTeamLeaderEmail: (value: string) => void;
  teamLeaderContact: string;
  setTeamLeaderContact: (value: string) => void;
  alternateContact: string;
  setAlternateContact: (value: string) => void;
  group: string;
  setGroup: (value: string) => void;
  branch: string;
  setBranch: (value: string) => void;
  semester: string;
  setSemester: (value: string) => void;

  // Player Fields
  numberOfPlayers: number;
  setNumberOfPlayers: (value: number) => void;
  minPlayers?: number;
  maxPlayers?: number;
  players: PlayerField[];
  setPlayers: (players: PlayerField[]) => void;

  // UI control
  hidePlayerFields?: boolean;

  // Validation
  emailError?: string | null;

  // Category (for sports that need it)
  category?: string;
  setCategory?: (value: string) => void;
  categoryOptions?: { label: string; value: string }[];
}

const RegistrationFormFields = ({
  teamLeaderName,
  setTeamLeaderName,
  teamLeaderEmail,
  setTeamLeaderEmail,
  teamLeaderContact,
  setTeamLeaderContact,
  alternateContact,
  setAlternateContact,
  group,
  setGroup,
  branch,
  setBranch,
  semester,
  setSemester,
  numberOfPlayers,
  setNumberOfPlayers,
  minPlayers,
  maxPlayers,
  players,
  setPlayers,
  category,
  setCategory,
  categoryOptions,
  hidePlayerFields,
  emailError,
}: RegistrationFormFieldsProps) => {
  const groups = ["AN/TE", "ME", "AE", "CE"];
  const branches = ["AN", "ME", "AE", "CE", "TE"];
  const semesters = ["1K", "2K", "3K", "4K", "5K", "6K"];

  const handlePlayerCountChange = (newCount: number) => {
    if (minPlayers !== undefined && newCount < minPlayers) return;
    if (maxPlayers !== undefined && newCount > maxPlayers) return;

    setNumberOfPlayers(newCount);

    // Player 1 = Team Leader (auto-filled), so we only need additional players
    // If total is 11, we only need 10 additional players (Player 2-11)
    const additionalPlayersNeeded = newCount > 1 ? newCount - 1 : 0;

    // Adjust players array to match additional players needed
    const currentPlayers = [...players];
    if (additionalPlayersNeeded > currentPlayers.length) {
      // Add new empty players
      while (currentPlayers.length < additionalPlayersNeeded) {
        currentPlayers.push({ name: "", branch: "", semester: "" });
      }
    } else {
      // Remove excess players
      currentPlayers.splice(additionalPlayersNeeded);
    }
    setPlayers(currentPlayers);
  };

  const handlePlayerFieldChange = (
    index: number,
    field: keyof PlayerField,
    value: string
  ) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = { ...updatedPlayers[index], [field]: value };
    setPlayers(updatedPlayers);
  };

  return (
    <div className="space-y-6">
      {/* Team Leader Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Team Leader Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Team Leader Name *
            </label>
            <input
              type="text"
              value={teamLeaderName}
              onChange={(e) => setTeamLeaderName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter team leader name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Team Leader Email *
            </label>
            <input
              type="email"
              value={teamLeaderEmail}
              onChange={(e) => setTeamLeaderEmail(e.target.value)}
              required
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                emailError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter team leader email"
            />
            {emailError && (
              <p className="mt-1 text-xs text-red-600">{emailError}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Team Leader Contact *
            </label>
            <input
              type="tel"
              value={teamLeaderContact}
              onChange={(e) => setTeamLeaderContact(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter contact number"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Alternate Contact *
            </label>
            <input
              type="tel"
              value={alternateContact}
              onChange={(e) => setAlternateContact(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter alternate contact"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Group *
            </label>
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select Group</option>
              {groups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Branch *
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select Branch</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Semester *
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select Semester</option>
              {semesters.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Selection (if needed) */}
      {categoryOptions && setCategory && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Category</h3>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Select Category</option>
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Number of Players Selector */}
      {minPlayers !== undefined && maxPlayers !== undefined && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Number of Players
            <span className="text-sm text-gray-500 font-normal ml-2">
              (Min: {minPlayers}, Max: {maxPlayers})
            </span>
          </h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handlePlayerCountChange(numberOfPlayers - 1)}
              disabled={numberOfPlayers <= minPlayers}
              className={`flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all ${
                numberOfPlayers <= minPlayers
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-orange-500 text-orange-600 hover:bg-orange-50"
              }`}
            >
              <Minus size={20} />
            </button>
            <div className="flex-1 text-center">
              <div className="text-3xl font-bold text-gray-900">
                {numberOfPlayers}
              </div>
              <div className="text-sm text-gray-500">
                Player{numberOfPlayers !== 1 ? "s" : ""}
              </div>
            </div>
            <button
              onClick={() => handlePlayerCountChange(numberOfPlayers + 1)}
              disabled={numberOfPlayers >= maxPlayers}
              className={`flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all ${
                numberOfPlayers >= maxPlayers
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-orange-500 text-orange-600 hover:bg-orange-50"
              }`}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Player Fields */}
      {players.length > 0 && !hidePlayerFields && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Player Information
          </h3>
          <div className="space-y-4">
            {/* Player 1 - Auto-filled from Team Leader (Read-only) */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border-2 border-orange-200">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="font-semibold text-gray-900">
                  Player 1 (Team Leader)
                </h4>
                <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full font-semibold">
                  Auto-filled
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Player Name *
                  </label>
                  <input
                    type="text"
                    value={teamLeaderName}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Branch *
                  </label>
                  <input
                    type="text"
                    value={branch}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Semester *
                  </label>
                  <input
                    type="text"
                    value={semester}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Additional Players (Player 2 onwards) */}
            {players.map((player, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg border border-gray-200"
              >
                <h4 className="font-semibold text-gray-700 mb-3">
                  Player {index + 2}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Player Name *
                    </label>
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) =>
                        handlePlayerFieldChange(index, "name", e.target.value)
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter player name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Branch *
                    </label>
                    <select
                      value={player.branch}
                      onChange={(e) =>
                        handlePlayerFieldChange(index, "branch", e.target.value)
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select Branch</option>
                      {branches.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Semester *
                    </label>
                    <select
                      value={player.semester}
                      onChange={(e) =>
                        handlePlayerFieldChange(
                          index,
                          "semester",
                          e.target.value
                        )
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select Semester</option>
                      {semesters.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationFormFields;
