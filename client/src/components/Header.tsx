import logo from "../assets/logo.png";
import { PlusIcon } from "lucide-react";
type HeaderProps = {
  search?: string;
  add?: string;
};

export default function Header({ search, add }: HeaderProps) {
  return (
    <div className="header">
      <div className="header-wrapper">
        <div className="left-section">
          <input type="text" placeholder={`Search for ${search}...`} />
        </div>
        <div className="right-section">
          <div className="add-wrapper">
            <button className="add-btn">
              <span>Add Task</span>
              {<PlusIcon size={15} strokeWidth={2} />}
            </button>
          </div>
          <div className="profile-wrapper">
            <img src={logo} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
