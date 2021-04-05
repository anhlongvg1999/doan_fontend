import React from "react";
import UserProfile from "../../../app/partials/layout/UserProfile";

export default class Topbar extends React.Component {
	render() {
		return (
			<div className="kt-header__topbar">
				<h3
					style={{
						position: "absolute",
						left: "22px",
						marginTop: "18px",
					}}
				>
					Management system
				</h3>
				<UserProfile showAvatar={true} showHi={true} showBadge={false} />
			</div>
		);
	}
}
