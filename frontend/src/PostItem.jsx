function PostItem(props){

    const currentUserId = localStorage.getItem("userId");

    return(
        <div className="post-item">
            {props.post.image && (
                <img
                    src={props.post.image}
                    className="room-image"
                    alt="room"
                    className="room-image"
                />
            )}
            <div className="post-content">
                <p>ชื่อหอพัก : {props.post.title}</p>
                <p className="price">ราคา : {props.post.price}/เดือน</p>
                <p>ประเภท : {props.post.roomtype}</p>
            
            
                <button onClick={() => props.onView(props.post)}>
                    ดูรายละเอียด
                </button>

                {props.post.userId === currentUserId &&(
                    <>
                        <button onClick={() => props.onEdit(props.post)}>
                        แก้ไข
                        </button>

                        <button onClick={() => props.onDelete(props.post._id)}>
                        ลบ
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default PostItem;